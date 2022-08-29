import './App.css';
import { GeoJsonDataSource, ImageryLayer, Viewer } from "resium";
import { Color, WebMapServiceImageryProvider } from 'cesium';
import { useCesium } from "resium";
import { Box, Checkbox, FormGroup, FormControlLabel, Paper, Popper } from '@mui/material';

function TogglePanel() {
  const { viewer } = useCesium();
  return (
    <Popper open={true}>
      <Paper elevation={2}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox
              onChange={(e, state) => {
                var ds = viewer.dataSources.getByName('wfs');
                // For some reason the data source is adding itself twice, so just set all of them.
                // TODO: actually use some sort of state thing for this.
                ds.forEach((d) => { d.show = state });
              }} />}
            label="Fire Perimeter Estimates" />
          {/* TODO: the other toggles. */}
        </FormGroup>
      </Paper>
    </Popper>
  );
}

function App() {
  return (
    <Box>
      <Viewer timeline={false} >
        <TogglePanel />
        {/* TODO: figure out why this is added to the list twice. */}
        <GeoJsonDataSource
          show={true}
          data={'https://cwfis.cfs.nrcan.gc.ca/geoserver/public/wfs?service=WFS&request=getFeature&typename=public:m3_polygons_current&srsName=EPSG:4326&outputformat=json'}
          fill={new Color(1, 0, 0, 1)}
          stroke={new Color(1, 1, 0, 0.1)}
          onLoad={collection => {
            collection.entities.values.forEach(f => {
              f.polygon.extrudedHeight = f.properties.area;
            });
          }}
        />
        <ImageryLayer
          name={'Fire Weather Index'}
          show={true}
          saturation={0.5}
          imageryProvider={new WebMapServiceImageryProvider({
            url: "https://cwfis.cfs.nrcan.gc.ca/geoserver/public/ows",
            layers: "fwi_current",
            parameters: {
              transparent: true,
              format: "image/png"
            }
          })} />
        <ImageryLayer
          name={'Administrative Borders'}
          show={true}
          imageryProvider={new WebMapServiceImageryProvider({
            url: "https://maps.geogratis.gc.ca/wms/canvec_en",
            layers: "administrative",
            parameters: {
              transparent: true,
              format: "image/png"
            }
          })} />
      </Viewer>
    </Box>
  );
}

export default App;
