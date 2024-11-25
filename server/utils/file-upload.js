
const dayjs = require('dayjs');
const fs = require('fs');
exports.fileUpload = async function (file, directory) {
    console.log("fileupload function executed")
    return new Promise((resolve, reject) => {
        try {
            let mime_type = file.split(";")[0].split(":")[1].split("/")[1];
            console.log("mime_type :", mime_type);

            if (mime_type === 'png' || mime_type === 'jpg' || mime_type === 'jpeg'|| mime_type === 'mp4' || mime_type === 'pdf') {
                console.log("file type allowed..");

                console.log("random number :", String(Math.floor((Math.random() * 100))));
                console.log("dayjs() :", dayjs());

                let file_name = dayjs() + String(Math.floor((Math.random() * 100))) + "." + mime_type;
                console.log("file_name :", file_name);

                let upload_path = `upload/${directory}`
                console.log("upload_path :", upload_path);

                let base64 = file.split(';base64,')[1];

                fs.mkdir(upload_path, {recursive : true}, (err) => {
                    if(err) {
                        console.log("err : ", err);
                        reject(err.message ? err.message : err);
                    }else {
                        let upload_path = `upload/${directory}/${file_name}`;
                        console.log("upload_path : ", upload_path);

                        fs.writeFile(
                            upload_path,
                            base64,
                            {encoding : "base64"},
                            function(err) {
                                if(err) {
                                    console.log("err : ", err);
                                    reject(err.message ? err.message : err);
                                }else {
                                    resolve(upload_path);
                                }
                            }
                        )
                    }
                })
                

            }

            else{
                console.log("Invalid file type");
                reject("File size up to 100mb and Formats .png, .jpeg, .jpg, .mp4, .pdf are only allowed");
            }
        }
        catch(error){
            console.log(error);
            reject(error.message ? error.message : error);
        }
    })
    
}