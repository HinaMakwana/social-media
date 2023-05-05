module.exports = {


  friendlyName: 'Upload image',


  description: '',


  inputs: {
    req : {
      type : 'ref'
    },
    fileName : {
      type : 'string'
    },
    dir : {
      type : 'string'
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },

  fn: async function (inputs) {
    let url
    let data = new Promise(async (Resolve, Reject)=> {
      await inputs.req.file(inputs.fileName).upload({
       saveAs: function(file, cb) {
         cb(null, file.filename);
       },
       dirname : `${inputs.dir}`
       },async (err, uploadedFiles) => {
           if(uploadedFiles.length === 0) {
             url = ' '
               return Resolve(url)
           }
           if(err){
               return Reject(err)
           } else {
            url = uploadedFiles[0]
            return Resolve(url)
           }
       })
    })
    return data

  }


};
