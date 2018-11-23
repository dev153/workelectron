const fooBar = exports.fooBar = () => {
    console.log("foobar");
}

const testFooBar = exports.testFooBar = () => {
    console.log("testFooBar");
}

class Promotion {
    constructor(id,version,attributes) {
        this.id = id;
        this.version = version;
        this.attributes = attributes;
    }

    toString() {
        var str = `id=${this.id}, version=${this.version}`;
        if ( this.attributes.length > 0 ) {
            str += `, attributes=[${this.attributes[0].toString()}`;
            for ( var i = 1; i < this.attributes.length; ++i ) {
                str += `,${this.attributes[i].toString()}`;
            }
            str += "]";
        } else {
            str += ', attributes=[]';
        }
        return str;
    }
    
    getId() {
        return this.id;
    }
}

class PromotionAttribute {
    constructor(type,data,index,parameters) {
        this.type = type;
        this.data = data;
        this.index = index;
        this.parameters = parameters;
    }

    toString() {
        var str = `type=${this.type}, data=${this.data}, index=${this.index}`;
        if ( this.parameters.length > 0 ) {
            str += `, parameters=[${this.parameters[0]}`;
            for ( var i = 1; i < this.parameters.length; ++i ) {
                str += `,${this.parameters[i]}`;
            }
            str += "]";
        } else {
            str += ', parameters=[]';
        }
        return str;
    }
}

const parsePromotion = (promotionListElement) => {
    var id = null;
    var version = null;
    var attributes = null;
    var promotionObj = null;
    var result = { 
        error: null,
        promotionObj: promotionObj
    };
    try {
        // Parse promotion id.
        if ( typeof(promotionListElement.id) !== "undefined" && 
            typeof(promotionListElement.id) === "number" && 
            Number.isInteger(promotionListElement.id) ) {
            id = promotionListElement.id;
        } else {
            throw "Promotion id is not defined or is not an integer number."
        }
        // Parse promotion version.
        if ( typeof(promotionListElement.version) !== "undefined" && 
            typeof(promotionListElement.version) === "number" && 
            Number.isInteger(promotionListElement.version) ) {
            version = promotionListElement.version;
       } else {
           throw "Promotion version is not defined or is not an integer number."
       }
       // Parse promotion attributes
       if ( promotionListElement.attributes && Array.isArray(promotionListElement.attributes) === true ) {
           const attributesParseResult = parsePromotionAttributes(promotionListElement.attributes);
           if ( attributesParseResult.attributes !== null ) {
                attributes = attributesParseResult.attributes;
           } else {
               throw attributesParseResult.error;
           }
       } else {
           throw "Promotion attributes  array is invalid."
       }
       result.promotionObj = new Promotion(id,version,attributes);
    } catch(e) {
        console.log(e);
        result.error = e;
    }
    return result;
}

const parsePromotionAttributes = (attributes) => {
    var result = { 
        error: null,
        attributes: []
    };
    try {
        for ( var i = 0; i < attributes.length; ++i ) {
            var parsePromotionAttributeResult = parsePromotionAttribute(attributes[i]);
            if ( parsePromotionAttributeResult.attribute !== null ) {
                result.attributes.push(parsePromotionAttributeResult.attribute);
            } else {
                throw parsePromotionAttributeResult.error;
            }
        }
    } catch(e) {
        result.error = e;
        result.attributes = null;
    }
    return result;
}

const parsePromotionAttribute = (attributeItem) => {
    var result = {
        error: null,
        attribute: null
    }
    var type = null;
    var data = null;
    var index = null;
    var parameters = [];
    try {
        // parse type
        if ( typeof(attributeItem.type) !== "undefined" && typeof(attributeItem.type) === "number" && 
            Number.isInteger(attributeItem.type) ) {
            type = attributeItem.type;
        } else {
            throw 'Attribute "type" value undefined or invalid.'
        }
        // parse data
        if ( typeof(attributeItem.data) !== "undefined" && typeof(attributeItem.data) === "string" ) {
            data = attributeItem.data;
        } else {
            throw 'Attribute "data" value is undefined or invalid.'
        }
        // parse index
        if ( typeof(attributeItem.index) !== "undefined" && typeof(attributeItem.index) === "number" && 
            Number.isInteger(attributeItem.index) ) {
                index = attributeItem.index;
        } else {
            throw 'Attribute "index" value undefined or invalid.'
        }
        // parse parameters
        if ( attributeItem.parameters && Array.isArray( attributeItem.parameters ) ) {
            for ( var i = 0 ; i < attributeItem.parameters.length; ++i ) {
                if ( Number.isInteger( attributeItem.parameters[i] ) ) {
                    parameters.push(attributeItem.parameters[i]);
                } else {
                    parameters = null;
                    throw 'Attribute "parameters" value undefined or invalid.'        
                }
            }
        } else {
            throw 'Attribute "parameters" value undefined or invalid.'
        }

        // Create the PromotionAttribute object to return.
        result.error = null;
        result.attribute = new PromotionAttribute(type,data,index,parameters);
    } catch(error) {
        result.error = error;
        result.attribute = null;
    }
    return result;
}

const parsePromotionsList = exports.parsePromotionsList = (promotionsList) => {
    var result = { 
        error: "", 
        promotionsMap: new Map()
    };

    if ( Array.isArray( promotionsList ) ) {
        for ( var i = 0; i < promotionsList.length; ++i ) {
            var parseResult = parsePromotion(promotionsList[i])
            if ( parseResult.promotionObj !== null ) {
                result.promotionsMap.set(parseResult.promotionObj.getId(), parseResult.promotionObj);
            } else {
                result.error = parseResult.error;
                break;
            }
        }
    } else {
        result.error = "Promotion list JSON object is not an array.";
    }
    return result;
}

exports.Promotion = Promotion;
exports.PromotionAttribute = PromotionAttribute;
