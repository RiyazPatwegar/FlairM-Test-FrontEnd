import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {

  warningMessage: any = null;
  successMessage: any = null;
  imageUrl = environment.imageUrl;
  orgnizationList : any = [];
  showOrgnizationInfo: boolean = false;
  showOrgnizationForm: boolean = false;
  selectedOrgnization: any = null;
  showOrgnizationContactForm : boolean = false;
  selectedOrgnizationContact : any = null;
  showOrgnizationContact: boolean = false;
  orgnizationImage: any = null;
  contactImage: any = null;

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.getList();
  }

  /* Get Organization List for First Coulmn */
  getList(orgId = null) {
    this.commonService.getList().subscribe((data)=>{
      //console.log(data);
      if(data['code'] !== 200){
        this.showWarning(data['message']);        
      }
      this.orgnizationList = data['data'];
      if(orgId !== null){
        this.showOrgnization(orgId);
      }
    });
  }

  /* On click organization show details in second column */
  showOrgnization(id) {
    this.showOrgnizationForm = false;
    this.showOrgnizationInfo = true;
    this.showOrgnizationContact = false;
    this.selectedOrgnization = this.orgnizationList.find(x => x.id == id);   
  }

  /* Show orgnization form on add btton */
  orgnizationForm() {
    this.showOrgnizationInfo = false;
    this.showOrgnizationForm = true;
    this.showOrgnizationContactForm = false;
    this.showOrgnizationContact = false;
  }

  /* Get uploaded file */
  fileOrgnization(fileInput: any){
    this.orgnizationImage = fileInput.target.files[0];
    //console.log(this.orgnizationImage);
  }

  /* submit orgnization details */
  onSubmit(forms) {
    //console.log(forms.value);
    console.log(this.orgnizationImage);
    if(!this.orgnizationImage){
      //console.log('Please select image');
      this.showWarning('Please select image');
      return false;
    }
    const uploadData = new FormData();
    uploadData.append('orgn_logo', this.orgnizationImage, this.orgnizationImage.name);
    uploadData.append('orgn_name', forms.value.name);
    uploadData.append('orgn_email', forms.value.email);

    this.commonService.createOrganization(uploadData).subscribe((data) => {
      if (data['code'] == 200) {
        //console.log('Organization added successfully');
        this.showSuccess('Organization added successfully');
        this.getList();
        this.contactImage = null;
        forms.reset();
      } else {
        console.log(data);
        this.showWarning(data['message']);
        return false;
      }
    });    
  }

  /* show orgnization contact form */
  newOrgnizationContact() {
    this.showOrgnizationContactForm = true;
    this.showOrgnizationContact = false;
  }

  /* show organization details */
  orgnizationContact(contact) {
    this.showOrgnizationContactForm = false;
    this.showOrgnizationContact = true;
    this.selectedOrgnizationContact = contact;
  }

  /* get contact image */
  fileContact(fileInput: any){
    this.contactImage = fileInput.target.files[0];
    //console.log(this.contactImage);
  }

  /* add organization contact details */
  onSubmitContact(forms) {
    //console.log(forms.value);
    //console.log(this.selectedOrgnization.id);
    if(!this.contactImage){
      this.showWarning('Please select photo');
      return false;
    }

    const contactDetails = new FormData();
    contactDetails.append('contact_photo', this.contactImage, this.contactImage.name);
    contactDetails.append('contact_address', forms.value.contact_address);
    contactDetails.append('contact_email', forms.value.contact_email);
    contactDetails.append('contact_name', forms.value.contact_name);
    contactDetails.append('contact_no', forms.value.contact_no);
    contactDetails.append('orgn_id', this.selectedOrgnization.id);
    
    this.commonService.addOrganizationContact(contactDetails).subscribe((data) => {
      //console.log(data)
      if(data['code'] == 200){
        //console.log('Contact details added successfully');
        this.showSuccess('Contact details added successfully');
        this.showOrgnizationContact = false;
        this.showOrgnizationContactForm = false;
        this.getList(this.selectedOrgnization.id);
        forms.reset();
        this.contactImage = null;
      }else{
        this.showWarning(data['message']);
        return false;
      }
    });    
  }
  
  showWarning(msg) {
    console.log(msg);
    if (msg == ''){
      return false;
    }
    this.warningMessage = msg;
    setTimeout(() => {
      this.warningMessage = '';
    }, 2000);
  }

  showSuccess(msg) {
    if (msg == ''){
      return false;
    }
    this.successMessage = msg;
    setTimeout(() => {
      this.successMessage = '';
    }, 2000);
  }
}
