import React, { useEffect, useRef } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-js.css';

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  FlowablePlatformPropertiesProvider
} from 'bpmn-js-properties-panel';


//import SpmsDesignerPropertiesPanelProvider from './SpmsDesignerPropertiesPanelProvider';

import { Box, IconButton, Toolbar } from '@mui/material';
import { Undo, Redo, ZoomIn, ZoomOut, Fullscreen, Save } from '@mui/icons-material';
import configure from './configure.json';

/**
 * Process Designer component that integrates with forms
 * @param {Object} props Component props
 * @param {string} [props.initialXml] Initial BPMN XML to load
 * @param {Function} props.onChange Callback when XML changes
 */
const ProcessDesigner = ({ initialXml, onChange ,onfullScreen }) => {
  const containerRef = useRef(null);
  const bpmnModelerRef = useRef(null);
  
  useEffect(() => {
    const modeler = new BpmnModeler({
      container: containerRef.current,
      propertiesPanel: {
        parent: '#js-properties-panel'
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        FlowablePlatformPropertiesProvider
      ],
      moddleExtensions: {
        flowable: configure
      }
    });

    bpmnModelerRef.current = modeler;

    // Load initial XML or create new diagram
    const loadDiagram = async () => {
      try {
        if (initialXml) {
          await modeler.importXML(initialXml);
        } else {
          await modeler.createDiagram();
          const { xml } = await modeler.saveXML({ format: true });
          //console.log(xml)
          onChange(xml);
        }
      } catch (err) {
        console.error('Error loading diagram:', err);
      }
    };

    loadDiagram();

    // Handle diagram changes
    modeler.on('commandStack.changed', async (x) => {
      try {
        //console.log(x)
        const { xml } = await modeler.saveXML({ format: true });
        //console.log(xml)
        onChange(xml);
      } catch (err) {
        console.error('Error saving diagram:', err);
      }
    });

    return () => modeler.destroy();
  }, [initialXml, onChange]);

  // Toolbar actions
  const handleUndo = () => bpmnModelerRef.current?.get('commandStack').undo();
  const handleRedo = () => bpmnModelerRef.current?.get('commandStack').redo();
  const handleChanged = () => {
    const { xml } = bpmnModelerRef.current.saveXML({ format: true });
    onChange(xml);
  };



  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      backgroundColor: '#f8f9fa'
    }}>
      <Toolbar sx={{
        minHeight: '48px !important'
      }}>
        <IconButton onClick={() => bpmnModelerRef.current.get('zoomScroll').stepZoom(0.1)} color="inherit">
          <ZoomIn />
        </IconButton>
        <IconButton onClick={() => bpmnModelerRef.current.get('zoomScroll').stepZoom(-0.1)} color="inherit">
          <ZoomOut />
        </IconButton>
        <IconButton onClick={handleUndo} color="inherit">
          <Undo />
        </IconButton>
        <IconButton onClick={handleRedo} color="inherit">
          <Redo />
        </IconButton>
        <IconButton onClick={() => {
          if(onfullScreen){
            onfullScreen()
          }
        }} color="inherit">
          <Save />
        </IconButton>
      </Toolbar>

      <Box sx={{
        display: 'flex',
        flexGrow: 1,
        overflow: 'hidden'
      }}>
        <Box
          ref={containerRef}
          sx={{
            flexGrow: 1
          }}
        />

        <div id="js-properties-panel"></div>
      </Box>
    </Box>
  );
};

export default ProcessDesigner;
