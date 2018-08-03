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
          <img :src="image.url" class="medium-sized">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ImageService from '../../../../services/imageService.js'
export default {
  components: {

  },
  data () {
    return {
      imported:[],
      photosToImport:false,
      images: [],
      imageUrls:[],
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
        })
        self.imported.sort(function(a,b){
          return b.createdAt - a.createdAt;
        })
      });
    },
    successCallback(){
      this.getPhotos();
      this.imageUrls = [];
      this.images = [];
      this.photosToImport = false;
    }
  },
  mounted(){
    this.getPhotos();
  }
}

</script>
<style scoped>
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

</style>
