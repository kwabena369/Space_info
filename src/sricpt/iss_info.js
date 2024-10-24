import axios from "axios"

let base_url_iss = "http://api.open-notify.org/";
let url_now = `${base_url_iss}iss-now.json`;

export default{
     
 _get_iss_location(){
     
    //  here is is returning a Promise
    return new Promise(
        async (resolve,reject)=>{

             await axios.get(url_now).then(
                (res)=>{
                 
                    const { data } = res 
                    if(data){
                        resolve(data)
                    }else{
                        let data = {
                            iss_position:{
                                longitude : 2,
                                latitude : 2

                            }
                        }
                        reject("no way")
                    }
                    
                }
             )

        }
    )
 },
    _getting_names_of_people_on_iss() {
     let urlPeopleThere = `${base_url_iss}astros.json`
     return new Promise(
         async (resolve, reject) => {
                   
             await axios.get(urlPeopleThere).then(
                 (res) => {
                     const { data } = res;
                     if (data) {
                         console.log(data)
                          resolve(data)
                     } else {
                          reject("there is an error")
                     }
                  }
              )
              
          }
     )
 }
     
}