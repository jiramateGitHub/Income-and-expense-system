import { TransactionCategoryPage } from './../transaction_category/transaction-category.page';
import { MPersonService } from '../../services/m_person/m-person.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController, NavParams, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-transaction-input',
  templateUrl: './transaction-input.page.html',
  styleUrls: ['./transaction-input.page.scss'],
})
export class TransactionInputPage implements OnInit {

  private type_input: string;
 
  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private toastController: ToastController, 
    private modalController: ModalController,
    private alertController: AlertController,
    private navParams: NavParams,
    private MPersonService: MPersonService
  ) { 
      this.type_input = navParams.get('type_input');
    }
 
  ngOnInit() {
   }

  async select_category_alert(){
    const alert = await this.alertController.create({
      header: 'Select Category',
      buttons: [
        {
          text: 'Income',
          cssClass: 'secondary',
          handler: () => {
            this.modal_taransaction_category_show("income")
          }
        },
        {
          text: 'Expense',
          cssClass: 'secondary',
          handler: () => {
            this.modal_taransaction_category_show("expense")
          }
        },
        {
          text: 'Cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }

  async modal_taransaction_category_show(type:string) {
    const modal = await this.modalController.create({
      component: TransactionCategoryPage,
      componentProps: {
        'type_input': type
      }
    });
    return await modal.present();
  }
 
  
// * @Function   : showToast => แสดง Toast
// * @Author     : Jiramate Phuaphan
// * @Create Date: 2563-03-01
  showToast(msg) {
    this.toastController.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

// * @Function   : close_modal => คำสั่งปิด modal
// * @Author     : Jiramate Phuaphan
// * @Create Date: 2563-03-01
  async close_modal(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}