const fastXmlParser = require('fast-xml-parser')
// const he = require('he')

function xml2js (xmlData) {
  const options = {
    // attributeNamePrefix: '@_',
    // attrNodeName: 'attr', // default is 'false'
    // textNodeName: '#text',
    ignoreAttributes: false
    // ignoreNameSpace: false,
    // allowBooleanAttributes: false,
    // parseNodeValue: true,
    // parseAttributeValue: false,
    // trimValues: true,
    // cdataTagName: '__cdata', // default is 'false'
    // cdataPositionChar: '\\c',
    // localeRange: '', // To support non english character in tag/attribute values.
    // parseTrueNumberOnly: false,
    // attrValueProcessor: a => he.decode(a, {isAttributeValue: true}), // default is a=>a
    // tagValueProcessor: a => he.decode(a) // default is a=>a
  }

  return fastXmlParser.parse(xmlData, options)
  // optional
  // if (fastXmlParser.validate(xmlData) === true) {
  //   const jsonObj = fastXmlParser.parse(xmlData, options)
  //   return jsonObj
  // }

  // Intermediate obj
  // const tObj = fastXmlParser.getTraversalObj(xmlData, options)
  // const jsonObj = fastXmlParser.convertToJson(tObj, options)
}
function js2xml (json) {
  const Parser = fastXmlParser.j2xParser

  // default options need not to set
  const defaultOptions = {
    // attributeNamePrefix: '@_',
    // attrNodeName: '@', // default is false
    // textNodeName: '#text',
    ignoreAttributes: false,
    // cdataTagName: '__cdata', // default is false
    // cdataPositionChar: '\\c',
    format: true
    // indentBy: '  '
    // supressEmptyNode: false,
    // tagValueProcessor: a => he.encode(a, {useNamedReferences: true}), // default is a=>a
    // attrValueProcessor: a => he.encode(a, {isAttributeValue: true, useNamedReferences: true}) // default is a=>a
  }
  const parser = new Parser(defaultOptions)
  return parser.parse(json)
}

module.exports = {xml2js, js2xml}
