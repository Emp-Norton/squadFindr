var playerMatch = function(player1, player2){

	var threshhold = 30;
	var matchHits = {};
	var ignore = ["uname", "steamId", "uPlayId", "name", "attrWeights", "friends"];

	for (var key in player1){
		if (!ignore.includes(key)){
			if (typeof player1[key] == "object"){
				var result = dynamicMatch(player1[key], player2[key]);
				// console.log(`Key: ${key} - Result: ${result}`)
				if (result * 100 >= threshhold){
					(matchHits[key]) ? matchHits[key] += result : matchHits[key] = 1;
				}
			} else {
				var result = primitiveMatch(player1[key], player2[key])
				if (result){
				  (matchHits[key]) ? matchHits[key] += 1 : matchHits[key] = 1;
				  // console.log(`Key: ${key} - Result: ${result}`)
				}
			}
		}
	}
	console.log(`Matches: ${JSON.stringify(matchHits)}`)
	var results = evaluatePriorities(matchHits, player1.attrWeights, player2.attrWeights);
	return results

}

var primitiveMatch = function(p1prop, p2prop){
	if (typeof p1prop == "boolean"){
		return (p1prop == p2prop) 
	} else {
		var ratio = Math.min.apply(null, [p1prop, p2prop]) / Math.max.apply(null, [p1prop, p2prop])
		return ratio
	}
}

var dynamicMatch = function(p1obj, p2obj){
	var gameCount = 0;
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
			  // console.log(`platform : ${nestedIdx} - Result ${result} - ${p1obj[nestedIdx].length}`)
			  matchAvgs.push(result * Math.max.apply(null, [p1obj[nestedIdx].length, p2obj[nestedIdx].length]))
			  gameCount += Math.max.apply(null, [p1obj[nestedIdx].length, p2obj[nestedIdx].length]);
			}
	}
	if (matchAvgs.filter(Boolean).filter(item => item !== 0).length < 1) return 0
	var result = matchAvgs.filter(Boolean).reduce((sum, num) => sum += num) / gameCount;
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

var evaluatePriorities = function(matches, p1prefs, p2prefs){
	var p1weighted = {};
	var p1total = 0;
	var p2weighted = {};
	var p2total = 0;
	//console.log(matches)
	for (var key in p1prefs){
		if (matches.hasOwnProperty(key)){
			p1weighted[key] = matches[key] * p1prefs[key];
			p2weighted[key] = matches[key] * p2prefs[key];
		}
	}

	console.log(`P1: ${JSON.stringify(p1weighted)}`)
	console.log(`P2: ${JSON.stringify(p2weighted)}`)

	for (var key in p1weighted){ // reduce?
		p1total += p1weighted[key];
		p2total += p2weighted[key];
	}

	// console.log(`Player 1 Matched? ${p1total >= 9}. Player 2 Matched? ${p2total >= 9}`)
	return [(p1total >= 9), (p2total >= 9)]
}