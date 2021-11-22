const {Schema, model} = require('mongoose');

const editorSchema = new Schema ({
    username: String,
    password: String,
    bio: String,
    email: String
},{
    timestamps: true
});

const Editor = model('Editor', editorSchema);

module.exports = Editor;