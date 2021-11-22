const {Schema, model} = require('mongoose');

const editorSchema = new Schema ({
    email: String,
    username: String,
    password:String,
    bio: String    
},{
    timestamps: true
});

const Editor = model('Editor', editorSchema);

module.exports = Editor;