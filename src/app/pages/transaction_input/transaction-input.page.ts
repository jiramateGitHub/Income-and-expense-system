import { ServicesService , MTransaction } from './../../services/services.service';
import { TransferInputPage } from './../transfer_input/transfer-input.page';
import { TransactionCategoryPage } from './../transaction_category/transaction-category.page';
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
  public 


  private MTransaction:MTransaction = {
    username : null,
    wallet_name : null,
    categories_type : null,
    categories_name : null,
    sub_categories_name : null,
    transaction_amount : null,
    transaction_date : null,
    transaction_note : null,
    transaction_active : null
  }
 
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private modalController: ModalController,
    private alertController: AlertController,
    private navParams: NavParams,
    private servicesService: ServicesService,
  ) { 
      this.type_input = navParams.get('type_input');
      
      console.log('constructor')
    }
 
  ngOnInit() {
    console.log('ngOnInit')
  }

  // * @Function   : select_category_alert => แสดง Select สำหรับเลือก Category Type
  // * @Author     : Jiramate Phuaphan
  // * @Create Date: 2563-03-02
  async select_category_alert() {
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
          text: 'Transfer',
          cssClass: 'secondary',
          handler: () => {
            this.modal_transfer_input_show("transfer")
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

  // * @Function   : modal_taransaction_category_show => แสดง Modal TransactionCategoryPage และ ตอนปิด Modal จะ Passing Data กลับมา
  // * @Author     : Jiramate Phuaphan
  // * @Create Date: 2563-03-02
  async modal_taransaction_category_show(type: string) {
    const modal = await this.modalController.create({
      component: TransactionCategoryPage,
      componentProps: {
        'type_input': type
      }
    });
    modal.onDidDismiss()
    .then((data) => {
      console.log(data)
      this.MTransaction.categories_type = data['data']['categories_type'];
      this.MTransaction.categories_name = data['data']['categories_name'];
      this.MTransaction.sub_categories_name = data['data']['sub_categories_name'];
    });
    return await modal.present();
  }

  // * @Function   : modal_transfer_input_show => แสดง Modal TransferInputPage และ ตอนปิด Modal จะ Passing Data กลับมา
  // * @Author     : Jiramate Phuaphan
  // * @Create Date: 2563-03-02
  async modal_transfer_input_show(type: string) { 
    const modal = await this.modalController.create({
      component: TransferInputPage,
      componentProps: {
        'type_input': type
      }
    });
    modal.onDidDismiss()
    .then((data) => {
      this.MTransaction.categories_type = data['data'].categories_type
      this.MTransaction.categories_name = data['data'].categories_name
      this.MTransaction.sub_categories_name = data['data'].sub_categories_name
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
  async close_modal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }


  // * @Function   : insert_transection => เพิ่มข้อมูล transectio
  // * @Author     : Kanathip Phithaksilp
  // * @Create Date: 2563-03-06
  async insert_transection() {
    this.MTransaction.username = this.servicesService.SessionService.get_session_username();
    this.MTransaction.wallet_name = this.servicesService.SessionService.get_session_wallet();
    this.MTransaction.transaction_active = "Y"

    this.servicesService.MTransactionService.insert_transection(this.MTransaction).then(() => {
      this.showToast('Insert Transection successful.');
    });

    this.close_modal();
  }

}
