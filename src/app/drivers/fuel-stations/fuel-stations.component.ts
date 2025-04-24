import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import TrimbleMaps, { RouteIconOptions } from '@trimblemaps/trimblemaps-js';
import { Observable, OperatorFunction } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { CurrencyPipe } from '@angular/common';

import {
  CustomerEntity,
  LocationAddress,
  MapsLocation,
  StationEntity,
} from '../../core/dtos/database-schema';
import { DriversService } from '../drivers.service';
import { UserInfo } from 'src/app/core/dtos/user-info';
import { PermissionList } from 'src/app/core/enums/system-roles';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-fuel-stations',
  templateUrl: './fuel-stations.component.html',
  styleUrls: ['./fuel-stations.component.scss'],
})
export class FuelStationsComponentimplements implements OnInit {
  map: TrimbleMaps.Map;
  fromLocation: MapsLocation;
  toLocation: MapsLocation;
  distanceLocation: number;
  searchRoute: TrimbleMaps.Route;
  searchingLocation = false;
  customers: CustomerEntity[] = [];
  stations: StationEntity[] = [];
  copyStations: StationEntity[] = [];
  selectedStationId = 0;
  isLoading = true;
  @ViewChild('feedbackContent', { static: false }) feedbackModal: ElementRef;
  stationModalId: number;
  layers: string[] = [];
  popup: TrimbleMaps.Popup;
  distanceInfo: string;
  customerIcons: { [id: number]: string } = {};
  iconUrls: { [id: number]: string } = {};
  appService: AppComponent;
  userInfo: UserInfo;
  canSeeDiscountPrices: boolean;
  canSeeDiscountedPrices: boolean;
  pageId = 1;
  selectedCustomerId: number;
  searchTerm:string;

  constructor(
    private service: DriversService,
    private pricePipe: CurrencyPipe
  ) {
    this.customerIcons = {
      [1]: `/assets/images/loves-logo.png?v=${Date.now()}`,
      [2]: `/assets/images/pilot-logo.png?v=${Date.now()}`,
      [3]: `/assets/images/petro-logo.png?v=${Date.now()}`,
      [4]: `/assets/images/ambest-logo.png?v=${Date.now()}`,
    };
    this.iconUrls = {
      [1]: `/assets/images/loves-icon.png?v=${Date.now()}`,
      [2]: `/assets/images/pilot-icon.png?v=${Date.now()}`,
      [3]: `/assets/images/petro-icon.png?v=${Date.now()}`,
      [4]: `/assets/images/ambest-icon.png?v=${Date.now()}`,
    };
  }

  ngOnInit(): void {
    this.getUserInfo();

    setTimeout(() => {
      this.initMap();
    }, 500);
  }

  onSearch(e: any): void {
    const query = `${e.value || ''}`;

    if (query.length < 3) {
      return;
    } else {
      const stations = this.copyStations.filter(
        (a) =>
          a.cityName.indexOf(query) ||
          a.address.indexOf(query) ||
          a.stateName.indexOf(query) ||
          a.name.indexOf(query)
      );

      if (this.selectedCustomerId > 0) {
        this.stations = stations.filter(
          (a) => a.customerId == this.selectedStationId
        );
      } else {
        this.stations = stations;
      }
    }
  }

  filterChains(customerId: number): void {
    this.selectedCustomerId = customerId;

    if (!customerId) {
      this.stations = this.copyStations;
    } else {
      this.stations = this.copyStations.filter(
        (a) => a.customerId == customerId
      );
    }
  }

  isSelectedCustomer(item: CustomerEntity): boolean {
    return this.customers.filter((a) => a.checked).indexOf(item) != -1;
  }

  get isValidFilter(): boolean {
    return !!this.fromLocation && !!this.toLocation;
  }

  searchLocation: OperatorFunction<string, MapsLocation[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searchingLocation = true)),
      switchMap((term) => this.service.searchLocations(term)),
      tap(() => (this.searchingLocation = false))
    );

  searchFormatter = (x: MapsLocation) => x.shortString;

  onSelectStation(station: StationEntity): void {
    this.selectedStationId = station.id;

    this.showPopup(station);
  }

  onSearchRoute(): void {
    if (this.searchRoute) {
      this.searchRoute.update({
        stops: [
          new TrimbleMaps.LngLat(
            this.fromLocation.coords.lon,
            this.fromLocation.coords.lat
          ),
          new TrimbleMaps.LngLat(
            this.toLocation.coords.lon,
            this.toLocation.coords.lat
          ),
        ],
      });
    } else {
      this.searchRoute = new TrimbleMaps.Route({
        routeId: 'searchRoute',
        isDraggable: true,
        distanceUnits: TrimbleMaps.Common.DistanceUnit.MILES,
        stopIcon: <RouteIconOptions>{
          opacity: 0,
          textOpacity: 0,
        },
        stops: [
          new TrimbleMaps.LngLat(
            this.fromLocation.coords.lon,
            this.fromLocation.coords.lat
          ),
          new TrimbleMaps.LngLat(
            this.toLocation.coords.lon,
            this.toLocation.coords.lat
          ),
        ],
        dragOptions: {
          snapKey: TrimbleMaps.Common.SnapKey.ALT,
          snapMode: TrimbleMaps.Common.SnapMode.DISABLE_WITH_KEY,
        },
        routeType: TrimbleMaps.Common.RouteType.PRACTICAL,
        reportType: [TrimbleMaps.Common.ReportType.MILEAGE],
      });
      this.searchRoute.on('routeloading', (e) => {
        this.clearMap();

        const features = e.target['_stopSourceData'].features;
        const locations = [];

        for (const feature of features) {
          const coordinates = feature.geometry.coordinates;
          locations.push(<LocationAddress>{
            lng: coordinates[0],
            lat: coordinates[1],
          });
        }

        console.log('New stops:', locations);

        this.calculateStops(locations);
      });
      this.searchRoute.addTo(this.map);
    }

    const center = new TrimbleMaps.LngLatBounds([
      new TrimbleMaps.LngLat(
        this.fromLocation.coords.lon,
        this.fromLocation.coords.lat
      ),
      new TrimbleMaps.LngLat(
        this.toLocation.coords.lon,
        this.toLocation.coords.lat
      ),
    ]);
    this.map.fitBounds(center);

    this.clearMap();

    this.calculateRoute();
  }

  onResetSearch(): void {
    if (!confirm('Are you sure?')) {
      return;
    }

    this.fromLocation = null;
    this.toLocation = null;
    this.distanceInfo = null;

    this.clearMap();

    this.map.zoomTo(3);
    this.customers.forEach((customer) => {
      customer.checked = true;
    });
    this.searchRoute.update({
      stops: [],
    });

    this.onChangeCustomer();
  }

  onChangeCustomer(): void {
    if (!this.isValidFilter) {
      this.clearMap();

      const selectedCustomerIds = this.customers
        .filter((a) => a.checked)
        .map((a) => a.id);
      if (selectedCustomerIds.length) {
        this.filterStations(selectedCustomerIds);
      }
    } else {
      this.onSearchRoute();
    }
  }

  getMarkerColor(customerId: number): string {
    return this.customers.find((a) => a.id == customerId)?.markerColor || '';
  }

  private initMap(): void {
    this.map = new TrimbleMaps.Map({
      container: 'map',
      style: TrimbleMaps.Common.Style.TRANSPORTATION,
      center: new TrimbleMaps.LngLat(-103.771556, 44.967243),
      zoom: 3,
      region: TrimbleMaps.Common.Region.NA,
      attributionControl: false,
      dragRotate: false,
    });

    this.map.addControl(
      new TrimbleMaps.AttributionControl({
        compact: true,
      })
    );
    this.map.addControl(new TrimbleMaps.FullscreenControl());
    this.map.addControl(
      new TrimbleMaps.NavigationControl({
        showCompass: false,
      }),
      'top-left'
    );
    this.map.addControl(
      new TrimbleMaps.ScaleControl({
        maxWidth: 80,
        unit: 'imperial',
      })
    );

    this.map.on('load', () => {
      this.loadCustomers();
    });
  }

  private filterStations(customerIds: number[]): void {
    this.isLoading = true;
    this.service.filterStations(customerIds).subscribe(
      (response) => {
        const stations = <StationEntity[]>response.data || [];
        if (stations.length) {
          if (this.pageId == 1) {
            this.loadPoints(customerIds, stations);
          } else {
            this.isLoading = false;
          }
          this.copyStations = stations;
          this.stations = stations;
        }
      },
      (err) => {
        this.isLoading = false;
        this.copyStations = [];
        this.stations = [];
      }
    );
  }

  onListing(): void {
    this.pageId = 2;

    if (!this.copyStations.length) {
      this.loadCustomers();
    }
  }

  private loadCustomers(): void {
    this.service.customers().subscribe((response) => {
      const customers = <CustomerEntity[]>response.data || [];

      for (const customer of customers) {
        customer.checked = true;
        if (this.pageId == 1) {
          setTimeout(() => {
            this.map.loadImage(this.iconUrls[customer.id], (error, image) => {
              const markerIcon = `poi_customer${customer.id}`;
              if (!this.map.hasImage(markerIcon)) {
                this.map.addImage(markerIcon, image);
              }
            });
          });
        }
      }

      const selectedCustomerIds = customers
        .filter((a) => a.checked)
        .map((a) => a.id);
      this.filterStations(selectedCustomerIds);

      this.customers = customers;
    });
  }

  private calculateRoute(): void {
    const selectedCustomerIds = this.customers
      .filter((a) => a.checked)
      .map((a) => a.id);

    if (selectedCustomerIds.length == 0) {
      return;
    }

    this.isLoading = true;
    this.service
      .calculateRoute(
        <LocationAddress>{
          lat: this.fromLocation.coords.lat,
          lng: this.fromLocation.coords.lon,
        },
        <LocationAddress>{
          lat: this.toLocation.coords.lat,
          lng: this.toLocation.coords.lon,
        },
        this.distanceLocation,
        selectedCustomerIds
      )
      .subscribe(
        (response) => {
          const stations = <StationEntity[]>response.data.stations || [];

          if (stations.length) {
            this.loadPoints(selectedCustomerIds, stations);

            this.stations = stations;
            this.copyStations = stations;
            this.distanceInfo = `${response.data.distance} mil / ${response.data.minutes} min`;
          }
        },
        (err) => {
          this.isLoading = false;
          this.stations = [];
          this.copyStations = [];
          this.distanceInfo = '';
        }
      );
  }

  private calculateStops(locations: LocationAddress[]): void {
    const selectedCustomerIds = this.customers
      .filter((a) => a.checked)
      .map((a) => a.id);

    if (selectedCustomerIds.length == 0) {
      return;
    }

    this.isLoading = true;
    this.service
      .calculateStops(locations, this.distanceLocation, selectedCustomerIds)
      .subscribe(
        (response) => {
          const stations = <StationEntity[]>response.data.stations || [];

          if (stations.length) {
            if (this.pageId == 1) {
              this.loadPoints(selectedCustomerIds, stations);
            } else {
              this.isLoading = false;
            }

            this.stations = stations;
            this.copyStations = stations;
            this.distanceInfo = `${response.data.distance} mil / ${response.data.minutes} min`;
          }
        },
        (err) => {
          this.isLoading = false;
          this.stations = [];
          this.copyStations = [];
          this.distanceInfo = '';
        }
      );
  }

  private loadPoints(customerIds: number[], stations: StationEntity[]): void {
    const geoData = <any>{
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    };

    for (const station of stations) {
      geoData.data.features.push({
        type: 'feature',
        properties: {
          name: this.nameFormmatter(station),
        },
        geometry: {
          type: 'Point',
          coordinates: [station.lng, station.lat],
        },
      });
    }

    const sourceId = 'stations-' + customerIds.join('');

    if (this.map.getSource(sourceId)) {
      this.map.removeSource(sourceId);
    }

    this.map.addSource(sourceId, geoData);

    for (const station of stations) {
      const layerId = 'poi_' + station.name;

      if (this.map.getLayer(layerId)) {
        this.map.removeLayer(layerId);
      }

      this.map
        .addLayer({
          id: layerId,
          type: 'symbol',
          source: sourceId,
          layout: {
            'icon-image': `poi_customer${station.customerId}`,
            'icon-size': 1,
            'text-field': '{name}',
            'text-anchor': 'top',
            'text-offset': [0, -3],
            'icon-offset': [1, 0],
            'text-line-height': 3,
            'text-size': 11,
            'text-font': ['Roboto Regular'],
          },
          filter: ['==', ['get', 'name'], this.nameFormmatter(station)],
        })
        .on('click', layerId, (e) => {
          this.selectedStationId = station.id;

          document.getElementById('station-item-' + station.id).scrollIntoView({
            block: 'center',
            behavior: 'smooth',
          });

          this.showPopup(station);
        });

      this.layers.push(layerId);
    }

    this.isLoading = false;
  }

  private showPopup(station: StationEntity): void {
    const center = <TrimbleMaps.LngLat>{
      lat: station.lat,
      lng: station.lng,
    };
    const zoom = this.map.getZoom();

    this.map.flyTo({
      zoom: zoom > 3 ? zoom : 7,
      center: center,
    });

    if (this.popup) {
      this.popup.remove();
    }

    const discountBlock = this.canSeeDiscountPrices
      ? `<tr>
          <td>Discount:</td>
          <th class="text-end">${this.pricePipe.transform(
            station.discountPrice
          )}</th>
       </tr>`
      : '';
    const discountedBlock = this.canSeeDiscountedPrices
      ? `<tr>
          <td>Discounted:</td>
          <th class="text-end">${this.pricePipe.transform(
            station.bestPrice
          )}</th>
        </tr>`
      : '';
    this.popup = new TrimbleMaps.Popup({
      closeButton: true,
      className: `trimble-maps-popup-color${station.customerId}`,
    })
      .setHTML(
        `<h5 class="fw-bold">${station.name}</h5>
            <hr/>
            <table class="w-100 fs-5">
                ${discountBlock}
                ${discountedBlock}
              <tr>
                <td>Retail:</td> 
                <th class="text-end">${this.pricePipe.transform(
                  station.retailPrice
                )}</th>
              </tr>
            </table>
            <hr/>
            <p class="fs-6">${station.address}, ${station.cityName}, ${
          station.stateName
        }</p>
            <div class="text-center mb-1">
              <a class="btn btn-secondary btn-sm m-0" href="https://maps.google.com?q=${
                station.lat
              },${station.lng}" target="_blank">View larger</a>
            </div>`
      )
      .setLngLat(center)
      .addTo(this.map);
  }

  private clearMap(): void {
    if (this.popup) {
      this.popup.remove();
    }

    this.layers.forEach((layer) => {
      if (this.map.getLayer(layer)) {
        this.map.removeLayer(layer);
      }
    });
    this.layers = [];

    this.distanceInfo = null;
    this.stations = [];
    this.copyStations = [];
    this.selectedStationId = 0;
  }

  private nameFormmatter(station: StationEntity): string {
    return `№ ${station.number} \n ${this.pricePipe.transform(
      this.canSeeDiscountedPrices ? station.bestPrice : station.retailPrice
    )}`;
  }

  private getUserInfo(): void {
    this.service.getUserInfo().subscribe((response) => {
      this.userInfo = <UserInfo>response.data;
      this.canSeeDiscountPrices =
        this.userInfo.permissionList?.includes(
          PermissionList.SHOW_DISCOUNT_PRICES
        ) || false;
      this.canSeeDiscountedPrices =
        this.userInfo.permissionList?.includes(
          PermissionList.SHOW_DISCOUNTED_PRICES
        ) || false;
    });
  }
}
