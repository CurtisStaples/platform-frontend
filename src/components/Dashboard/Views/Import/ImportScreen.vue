<template>
  <div class="content">
    <div class="">
                <button type="button" class="btn btn-xl" @click.prevent="onUploadPhotos()">UPLOAD PHOTOS</button>
                <input type ="file" class="display-none"
                  ref="uploader"
                  accept="image/*"
                  multiple
                  @change="onFilesChosen">
    </div>


      <modal name="zoom-imgs" class="stretch-height">
        <div class="row">
          <div class="col-md-6">
            <img :src="zoomedImg.url" class="medium-sized">
          </div>
          <div class="col-md-6">
            <p> <span class="bold">Image:</span> {{zoomedImg.label.ID}}</p>
            <p> <span class="bold">Inspection Date:</span> {{getInspectionDate(zoomedImg.label.InspectionDate.seconds)}}</p>
            <p><span class="bold">Location:</span>  {{zoomedImg.label.Location}} </p>
            <p> <span class="bold">Labels: </span> {{zoomedImg.label.labels}}</p>
            <p> <span class="bold">Defect Severity: </span> {{zoomedImg.label.DefectSeverity}} </p>
            <p> <span class="bold">Confidence:</span>  {{zoomedImg.label.Confidence}}</p>
          </div>
        </div>
          <button type="button" class="btn btn-md btn-success margin-below" @click.prevent="hideModal()">Hide Modal</button>

      </modal>

    <div class="row">
      <div v-for = "url in imageUrls" class ="col-md-4 mt-2-5">
        <img :src="url" class="medium-sized">
      </div>
    </div>
    <button v-if="photosToImport" type="button" class="btn btn-xl black-button" @click.prevent="createPhotos()">IMPORT</button>
    <hr>
    <div class="container-fluid">
      <h3> Imported Photos </h3>
      <div class="row">
        <div v-for = "image in imported" class ="col-md-4 mt-2-5">
          <img :src="image.url" class="medium-sized" @click.prevent= "showModal(image)">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ImageService from '../../../../services/imageService.js'
//import geocoder from 'geocoder'
export default {
  components: {

  },
  data () {
    return {
      imported:[],
      photosToImport:false,
      images: [],
      imageUrls:[],
      zoomedImg: {},
    }
  },
  methods: {
    onUploadPhotos(){
      this.$refs.uploader.click();
    },
    onFilesChosen(event){
      const files = event.target.files;
      let self = this;
      let filesLength = files.length;
      let fileArray = this.getFileArray(files,filesLength);
      fileArray.forEach(function(file){
        let fileName = file.name;
        if(fileName.lastIndexOf('.')<=0) return alert('Please valid files only');
        const fileReader = new FileReader();
        let imageUrl;
        fileReader.addEventListener('load',() =>{
          imageUrl = fileReader.result;
          self.imageUrls.push(imageUrl);
        })
          fileReader.readAsDataURL(file)
          self.images.push(file);
          console.log("images", self.images);
          self.photosToImport = true;
      });
    },
    getFileArray(files,length){
      let fileArray = [];
      for(let i = 0; i < length; i++){
        let file = files[i];
        fileArray.push(file);
      }
      return fileArray;
    },
    createPhotos() {
    let downloadUrls = [];
    let self = this;
    console.log("add to post",this.images);
    this.images.forEach((image) => {
      ImageService.getImageURL(image.name, image).then(function(url){
          downloadUrls.push(url);
          console.log(downloadUrls);
          if(downloadUrls.length == self.images.length){
            ImageService.addImages(downloadUrls, self.successCallback);
            return;
          }
        });
      });
    },
    getPhotos(){
      let self = this;
      ImageService.getImportedPhotos().then(function(querySnapshot){
        self.imported = querySnapshot.docs.map(doc => {
          let image = doc.data();
          image.id = doc.id;
          return image;
        });
        self.imported.sort(function(a,b){
          return b.createdAt - a.createdAt;
        });
        self.zoomedImg = self.imported[0];
      });
    },
    successCallback(){
      this.getPhotos();
      this.imageUrls = [];
      this.images = [];
      this.photosToImport = false;
    },
    showModal(image){
      this.zoomedImg = image;
      console.log(image);

      this.$modal.show('zoom-imgs');
    },
    hideModal(){
      this.$modal.hide('zoom-imgs');
    },
    getInspectionDate(seconds){
      console.log(seconds);
      var utcSeconds = seconds;
      var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
      d.setUTCSeconds(utcSeconds);
      console.log(d,d.getYear());
      let date = "" + (d.getMonth() + 1) + '/'+ d.getDate()+ '/'+ d.getFullYear();
      return date;
    },
    getLocation(lat,lon){
      let self = this;
      return geocoder.reverseGeocode(lat, lon, function(err, res) {
        console.log(res);
        return "hello"
      });
    }
  },
  mounted(){
    this.getPhotos();
  }
}

</script>
<style scoped>
.bold{
  font-weight: bold;
}
.medium-sized{
  height: 250px;
  width: 250px;
}
.mt-2-5{
  margin-top: 2.5% !important;
}
.display-none{
  display: none;
}
.margin-below{
  margin-bottom: 2.5%;
}
.stretch{
  height: 20%;
}
.v--modal{
  height: auto !important;
}

</style>
