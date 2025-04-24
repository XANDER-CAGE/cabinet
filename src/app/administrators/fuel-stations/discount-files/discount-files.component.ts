import { Component, Input, OnInit } from '@angular/core';

import { HttpService } from '../../../core/services/http.service';
import { DiscountedFileEntity } from '../../../core/dtos/database-schema';

@Component({
  selector: 'app-discount-files',
  templateUrl: './discount-files.component.html',
  styleUrls: ['./discount-files.component.scss'],
})
export class DiscountFilesComponent implements OnInit {
  @Input('items') files: DiscountedFileEntity[] = [];

  downloadingProcess = false;

  constructor(private http: HttpService) {}

  ngOnInit(): void {}

  downloadFile(item: DiscountedFileEntity): void {
    this.downloadingProcess = true;
    this.http.download(`api/Admin/ImportedFile/${item.id}`).subscribe(
      (response) => {
        const url = URL.createObjectURL(response);
        const link = document.createElement('a');
        document.body.appendChild(link);
        link.setAttribute('style', 'display: none');
        link.href = url;
        link.download = item.fileName;
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
        this.downloadingProcess = false;
      },
      (error) => {
        this.downloadingProcess = false;
      }
    );
  }
}
