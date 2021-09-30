const countries = require('../store/Shipping/Countries');

function mapCountries() {
  return countries.map( entry => ({ countryCode: entry.countryCode, countryName: entry.country }));
}

function mapRegions(country) {
  return countries.find( ob => ob.countryCode === country ).regions;
}

function mapShippingOptions(country, region) {
  return mapRegions(country).find( ob => ob.regionCode === region).shippingOptions;
}

module.exports.getCountries = ( req, res ) => {
  res.status(200).json({
    success: true,
    data: mapCountries()
  });
}

module.exports.getRegions = ( req, res ) => {
  const countryCode = req.params.countryCode;

  res.status(200).json({
    success: true,
    data: mapRegions(countryCode)
  });
}

module.exports.getShippingOptions = ( req, res ) => {
  const countryCode = req.params.countryCode;
  const regionCode = req.params.regionCode;

  res.status(200).json({
    success: true,
    data: mapShippingOptions(countryCode, regionCode)
  });
}

