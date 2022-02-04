let tags = []

for (let line of global["tags"]) {
    let data = line.split("=")
    for (let type of data[1].split(",")) {
        tags.push("forge:" + type + "/" + data[0])
    }
}

onEvent("recipes", event => { 
    let priority = global["priority"]
    var tagitems = new Map()
    tagLoop:
    for (let tag of tags) {
        let ingr = Ingredient.of("#"+tag)
        if (ingr) {
            let stacks = ingr.getStacks().toArray()
            for (let mod of priority) {
                for (let stack of stacks) {
                    if (stack.getMod() == mod) {
                        tagitems[tag] = stack.getId()
                        continue tagLoop
                    }
                }
            }
            if (stacks.length > 0) tagitems[tag] = stacks[0].getId()
        }
    }
    global["unifytags"] = tags
    global["tagitems"] = tagitems
    
    if (global["RECIPE_UNIFY"]) {
        for (let tag of global["unifytags"]) {
            let ingr = Ingredient.of("#"+tag)
            if (ingr) {
                let stacks = ingr.getStacks().toArray()
                let oItem = global["tagitems"][tag]
                for (let tItem of stacks) {
                    event.replaceInput({}, tItem.getId(), "#"+tag)
                    event.replaceOutput({}, tItem.getId(), oItem)
                }
            }
        }
    }
})

onEvent("player.tick", event => {
    console.log(tags)
})