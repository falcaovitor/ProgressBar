class ProgressBar{
    constructor(){
        this.btnSendFile = document.querySelector('#btnSend');
        this.fileEl = document.querySelector('#files');
        this.snackBar = document.querySelector('#snackBar');
        this.timeleft = document.querySelector('.timeleft');
        this.snackFileName = document.querySelector('.name');
        this.timestemp = document.querySelector('.hourTime');
        this.snackBarProgress = document.querySelector('.progressW');
        this.initEvents();
    };

    initEvents(){
        this.btnSendFile.addEventListener('click', e => {
            this.fileEl.click();
        });
        this.fileEl.addEventListener('change', e => {
            this.uploadTask(e.target.files);
            this.modalShow();
        });
    };
    modalShow(show = true){
        this.snackBar.style.display = (show) ? 'block' : 'none';
    }
    uploadEnd(){
        this.fileEl.value = '';
    }
    uploadTask(files){
        let promises = [];

        [...files].forEach(file => {
            promises.push(new Promise((resolve, reject) => {
                let ajax = new XMLHttpRequest();

                ajax.onload = event => {
                    try{
                        this.modalShow(false);
                        this.uploadEnd();
                        resolve(JSON.parse(ajax.responseText));
                    }catch(e){
                        reject(e);
                    }
                };

                ajax.onerror = event => {
                    this.modalShow(false);
                    this.uploadEnd();
                    reject(e);
                };
                ajax.upload.onprogress = event => {
                    this.uploadProgress(event, file);
                };

                ajax.open('POST', '/uploads');
                let formData = new FormData();
                formData.append('input-file', file);
                this.startUpload = Date.now();
                ajax.send(formData);
            }));
        });
        return Promise.all(promises);
    };
    uploadProgress(event, file){
        let remaining = Date.now() - this.startUpload;
        let loaded = event.loaded;
        let total = event.total;
        let porcent = parseInt((loaded / total) * 100);
        let timeEnd = ((100 - porcent) * remaining) / porcent;
        this.timeleft.innerText = `${porcent}%`;
        this.snackFileName.innerText = this.snackFileNames(file);
        this.timestemp.innerText = this.uploadEnd(timeEnd);
        this.snackBarProgress.style.width = `${porcent}%`;
    };
    snackFileNames(file){
        if(file.name.length >= 8){
            let fileName = file.name.substring(0, 7);
            return `${fileName}...`;
        }
    }
    uploadEnd(duration){
        let hours = parseInt((duration / 1000 * 60 * 60) % 24); 
        let minutes = parseInt((duration / 1000 * 60) % 60);
        let seconds = parseInt((duration / 1000) % 60); 
        if(hours > 0){
            return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;
        }
        if(minutes > 0){
            return `${minutes} minutos e ${seconds} segundos`;
        }
        if(seconds > 0){
            return `${seconds} segundos`;
        }
        return '';
    };
};