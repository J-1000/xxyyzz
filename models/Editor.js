const {Schema, model} = require('mongoose');

const editorSchema = new Schema ({
    username: String,
    password: String
},{
    timestamps: true
});

const Editor = model('Editor', editorSchema);

module.exports = Editor;