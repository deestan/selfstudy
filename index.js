try {
  require('./server');
} catch (error) {
  if (error.code == 'MODULE_NOT_FOUND') {
    console.log(
"        _______________________________________\n\
       |,---\"-----------------------------\"---,|\n\
       ||                                     ||\n\
       ||                                     ||\n\
       ||                                     ||\n\
       ||            > npm install            ||\n\
       ||                                     ||\n\
       ||                                     ||\n\
       ||                                     ||\n\
       ||_____,_________________________,_____||\n\
       |)_____)-----.|__________|.------(_____(|\n\
     //\"\"\"\"\"\"\"|_____|=----------=|______|\"\"\"\"\"\"\"\\\n\
    // _| _| _| _| _| _| _| _| _| _| _| _| _| _| \\\n\
   // ___| _| _| _| _| _| _| _| _| _| _| _|  |  | \\\n\
  |/ ___| _| _| _| _| _| _| _| _| _| _| _| ______| \\\n\
  / __| _| _| _| _| _| _| _| _| _| _| _| _| _| ___| \\\n\
 / _| _| _| _| ________________________| _| _| _| _| \\\n\
|------\"--------------------------------------\"-------|\n\
`-----------------------------------------------------'");
    console.log(error.message);
  } else {
    console.error(error.stack || error);
    process.exit(1);
  }
}
