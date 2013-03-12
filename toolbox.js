davis=
{
random:function (x)
	{
		return (Math.floor(Math.random()*x));
	},

bell: function (x)
	{
		var i=Math.round((davis.random(x)+davis.random(x)+davis.random(x))/3);
		return i;
	},

randomColor:function (x)
	{
    var red=0;
    var green=0;
    var blue=0;
    if (x=="grey" || x=="gray"){
        red=davis.bell(255);
        green=red;
        blue=red;
        }
    else{
        red=davis.random(255);
    	green=davis.random(255);
    	blue=davis.random(255);
        }
	var color="rgb("+red+","+green+","+blue+")";
	return color;
	},
	
pick: function (x)
	{
	return x[davis.random(x.length)];
	}
};