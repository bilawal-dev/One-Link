import mongoose from 'mongoose';

const bitTreeSchema = new mongoose.Schema({
  // Handle is a unique identifier for each BitTree
  handle: { 
    type: String,
    required: true
  },

  // links: an array of objects that store link data
  links: {
    type: [
      {
        // link field stores the URL
        link: {
          type: String, 
          required: true
        },
        
        // linktext field stores the text that will be displayed for the link
        linktext: {
          type: String, 
          required: true
        }
      }
    ],
    required: true // Ensures that links are always provided
  },

  // Pic: stores the image associated with the BitTree
  pic: {
    // name field stores the file name of the image
    name: {
      type: String, 
      required: true
    },

    // data field stores the binary data of the image as a Buffer
    data: {
      type: Buffer, // Buffer is used to store binary data (image)
      required: true
    },

    // contentType field stores the MIME type of the image (e.g., 'image/jpeg')
    contentType: {
      type: String, 
      required: true
    },

    // uploadedAt stores the timestamp of when the image was uploaded
    uploadedAt: {
      type: Date, 
      default: Date.now
    }
  },

  // Desc: description for the BitTree
  desc: { 
    type: String, 
    required: true
  },

  // UserId: stores the session id of each user, for authorization purposess
  userId: {
    type: String,
    required: true
  }
});

// If the 'Links' model already exists in mongoose, use that model, otherwise create a new model
const bitTreeModel = mongoose.models.Links || mongoose.model('Links', bitTreeSchema);

export default bitTreeModel;