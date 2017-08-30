# Signed console (scons)

Signed console will trace time, function name and file name.
Useful for faster debugging.

Use it like standard console, for example: scons.log().


> scons.log("abc", {a: "a"})

in function "someFunction()" will print


> -21:11:33.315------------------------------------/file.js:6:11  someFunction() -   
> abc  
> { a: 'a' }


## Usage

scons.log()

scons.warn()

scons.error()

## License

[MIT](http://vjpr.mit-license.org)
