import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    RouterModule,
    TranslateModule  
  ],
})
export class AppComponent implements OnInit {
  isLoading = true;
  
  constructor(
    private router: Router,
    private translate: TranslateService  
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/home']);
    }, 3000);
  }
}