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
            <p> <span class="bold">Location:</span> <a v-bind:href="getLocationLink(zoomedImg.label.Location._lat,zoomedImg.label.Location._long)" target="_blank">View Location</a> </p>
            <p> <span class="bold">Labels: </span> {{getFormattedLabels(zoomedImg.label.labels)}}</p>
            <p> <span class="bold">Defect Severity: </span> {{zoomedImg.label.DefectSeverity}} </p>
            <p> <span class="bold">Confidence Percentage:</span>  {{zoomedImg.label.Confidence}}</p>
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
import ImageService from '../../../../services/imageService.js' // middleware to communicate with firebase
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
    onUploadPhotos(){ // client clicks upload photos button
      this.$refs.uploader.click();
    },
    onFilesChosen(event){ // once they have chosen all images to upload
      const files = event.target.files;
      let self = this;
      let filesLength = files.length;
      let fileArray = this.getFileArray(files,filesLength); // returns a formatted array with uploaded user files
      fileArray.forEach(function(file){
        let fileName = file.name;
        if(fileName.lastIndexOf('.')<=0) return alert('Please valid files only'); // run a check on each file
        const fileReader = new FileReader();
        let imageUrl;
        fileReader.addEventListener('load',() =>{ // once the image is done being read by the file reader
          imageUrl = fileReader.result; // get the imageUrl ref to the image
          self.imageUrls.push(imageUrl);
        })
          fileReader.readAsDataURL(file)
          self.images.push(file); // push this file to the set of images that need to be upload
          console.log("images", self.images);
          self.photosToImport = true;
      });
    },
    getFileArray(files,length){ // returns a formatted array with uploaded user files
      let fileArray = [];
      for(let i = 0; i < length; i++){
        let file = files[i];
        fileArray.push(file);
      }
      return fileArray;
    },
    createPhotos() { // once the user chooses to upload the chosen images. This will create image documents in the images collection for the uploaded photos
    let downloadUrls = [];
    let self = this;
    console.log("add to post",this.images);
    this.images.forEach((image) => {
      ImageService.getImageURL(image.name, image).then(function(url){ // get the Firebase Storage Url ref for the image
          downloadUrls.push(url);
          console.log(downloadUrls);
          if(downloadUrls.length == self.images.length){ // once finished
            ImageService.addImages(downloadUrls, self.successCallback); // add each of the image urls to firestore, so we can access the reference later
            return;
          }
        });
      });
    },
    getPhotos(){ // get the imported photos related to the current user's company and will set the initial placeholder for the zoomed img
      let self = this;
      ImageService.getImportedPhotos().then(function(querySnapshot){
        self.imported = querySnapshot.docs.map(doc => {
          let image = doc.data();
          image.id = doc.id;
          return image;
        });
        self.imported.sort(function(a,b){
          return b.createdAt - a.createdAt; // the most recent imports will show first
        });
        self.zoomedImg = self.imported[0]; // set an iniital variable for the image chosen to zoom into
      });
    },
    successCallback(){ // after the photos are uploaded, make sure to reset everything
      this.getPhotos(); // fetch photos again
      this.imageUrls = [];
      this.images = [];
      this.photosToImport = false;
    },
    showModal(image){ // show the zoomed img and information for the passed in image
      this.zoomedImg = image;
      console.log(image);

      this.$modal.show('zoom-imgs');
    },
    hideModal(){
      this.$modal.hide('zoom-imgs');
    },
    getInspectionDate(seconds){ // convert seconds to a readeable date
      console.log(seconds);
      var utcSeconds = seconds;
      var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
      d.setUTCSeconds(utcSeconds);
      console.log(d,d.getYear());
      let date = "" + (d.getMonth() + 1) + '/'+ d.getDate()+ '/'+ d.getFullYear();
      return date;
    },
    getFormattedLabels(labels){ // format the labels to a readable formatted
      let result = "";
      for(let i = 0; i < labels.length; i++){
        result +=labels[i];
        if(i !== labels.length -1) result += ",";
      }
      return result;
    },
    getLocationLink(lat,lon){ // link to Google Maps based on latitude and longitude
      let baseUrl = 'https://maps.google.com/?q=';
      lat = "" + lat;
      lon = "" + lon;
      let url = baseUrl + lat + "," + lon;
      return url
    }
  },
  mounted(){ // on mount, fetch the already imported photos from the current user's company 
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
