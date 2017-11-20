var playerMatch = function(player1, player2){

	var threshhold = 75;
	var matchHits = 0; 
	var ignore = ["uname", "steamId", "uPlayId", "name"];

	for (var key in player1){
		if (ignore.includes(key) == false){
			if (typeof player1[key] == "object"){
				var result = dynamicMatch(player1[key], player2[key]);
				console.log(`Key: ${key} - Result: ${result}`)
				if (result * 100 >= threshhold){
					matchHits += 1;
				}
			} else {
				var result = primitiveMatch(player1[key], player2[key])
				console.log(`Key: ${key} - Result: ${result}`)
			}
		}
	}

}

var primitiveMatch = function(p1prop, p2prop){
	if (typeof p1prop == "boolean"){
		return (p1prop == p2prop) 
	} else {
		var diff = Math.abs(p1prop - p2prop);
		var ratioDiff = Math.min.apply(null, [p1prop, p2prop]) / diff;
		return ratioDiff
	}
}

var dynamicMatch = function(p1obj, p2obj){
	var maxLength = Math.max.apply(null, [p1obj.length, p2obj.length]);
	var overlapRatio;
	var matchedElements = [];
	var matchAvgs = [];
	var isArray = p1obj.constructor.toString().split(" ").includes("Array()");
	if (isArray){
		for (var idx = 0; idx < maxLength; idx++){
			if (p2obj.includes(p1obj[idx])){
				matchedElements.push(p1obj[idx])
			}
		}
		return (matchedElements.length) ? matchedElements.length / maxLength : 0

	} else {
			for (var nestedIdx in p1obj){
			  var result = dynamicMatch(p1obj[nestedIdx], p2obj[nestedIdx]);
			  console.log(`platform : ${nestedIdx} - Result ${result}`)
			  matchAvgs.push(result)
			}
	}
	var result = matchAvgs.filter(Boolean).reduce((sum, num) => sum += num) / matchAvgs.length;
	return result
}

var totalGameOverlap = function(p1, p2){
	var totalOverlap = dynamicMatch(p1.games, p2.games);
	return totalOverlap
}

var platformOverlap = function(p1, p2, platform){
	var platformOverlap = dynamicMatch(p1.games[platform], p2.games[platform]);
	return platformOverlap
}