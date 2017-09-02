# Signed console (scons)

Signed console will automaticly print time, function, file in fixed width line.
Useful for faster debugging, when you don't want to write any identification details for every log, like:

> console.log(1); console.log("end") // etc.

Use it like standard console, for example: 

> var scons = require("scons");  
> scons.log() 

will print

> -21:11:33.315-----------------------------------/someFile.js:6:11  someFunction() -

and

> scons.log("abc", {a: "a"})

in function "someFunction()" will print


> -21:11:33.315----------------------------------------------/file.js:6:11  someFunction() -   
> abc  
> { a: 'a' }


## Usage

scons.log(...)
scons.warn(...)
scons.error(...)

## License

[MIT](http://mit-license.org)
