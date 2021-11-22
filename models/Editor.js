const {Schema, model} = require('mongoose');

const editorSchema = new Schema ({
    firstName: String,
    lastName: String,
    dob: Date,
    email: String,
    username: String,
    password:String
},{
    timestamps: true
});

const Editor = model('Editor', editorSchema);

module.exports = Editor;