const randomCode = () => {
    var characters = "abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ2346789";
    var randomCode = "";
    for (i=0; i<7; i++) randomCode +=characters.charAt(Math.floor(Math.random()*characters.length)); 
    return(randomCode.toUpperCase());
}


module.exports = {
    randomCode,
}


