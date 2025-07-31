import React from 'react';
import ReactFlow, { Background, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { Box } from '@mui/material';

const OrganizationChartVisualization = ({ chartData, mode }) => {
  // Convert chartData to nodes and edges
  const { nodes, edges } = convertChartData(chartData, mode);

  console.log(chartData)
  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={true}
        nodesConnectable={true}
        panOnScroll
        minZoom={0.5}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        attributionPosition="bottom-right"
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        <Background color="#aaa" gap={16} />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === 'group') return '#ff0072';
            if (node.type === 'entity') return '#0041d0';
            return '#00ff00';
          }}
          zoomable
          pannable
        />
      </ReactFlow>
    </Box>
  );
};

const convertChartData = (data, mode) => {
  const nodes = [];
  const edges = [];
  const offset = 200;
  const layerOffset = 100;
  console.log(data)
  // Add root node
  var length = data.children?.length ?? 0;
  //var rootNodeX = length * 200 / 2;

  nodes.push({
    id: data.id,
    type: 'baseNode',
    position: { x: 0, y: 0 },
    data: { label: data.name },
    style: {
      backgroundColor: '#ff0072',
      color: '#fff',
      border: '1px solid #222',
      borderRadius: 5,
      padding: 10,
    },
  });

  // Add child nodes based on mode
  if (mode === 'REALISTIC') {
    nodes.push({
      id: 'vendors',
      type: 'baseNode',
      position: { x: offset * - 3, y: layerOffset },
      data: { label: "Vendor" },
      style: {
        background: "#dfdfdf"
      }
    });

    nodes.push({
      id: 'customers',
      type: 'baseNode',
      position: { x: offset * - 4, y: layerOffset },
      data: { label: "CUSTOMER" },
      style: {
        background: "#dfdfdf"
      }
    });

    edges.push({
      type: 'smoothstep',
      id: `e${data.id}-vendor`,
      source: data.id,
      target: `vendors`,
    });

    edges.push({
      type: 'smoothstep',
      id: `e${data.id}-customers`,
      source: data.id,
      target: `customers`,


    });
    var customerIndex = 1;
    var vendorIndex = 1
    var childIndex = 1;


    data.children?.forEach((child, index) => {
      if (child.type === "CUSTOMER") {
         nodes.push({
          id: child.id,
          type: 'baseNode',
          position: { x: offset * - 4, y: layerOffset *  ++customerIndex },
          data: { label: child.name }
        });

      } else if (child.type === "VENDOR") {
         nodes.push({
          id: child.id,
          type: 'baseNode',
          position: { x: offset * - 3, y: layerOffset * ++vendorIndex },
          data: { label: child.name }
        });
      } else {
        childIndex ++;
        nodes.push({
          id: child.id,
          type: 'baseNode',
          position: { x: offset * (childIndex - 4 ), y: layerOffset },
          data: { label: child.name }
        });
        edges.push({
          id: `e${data.id}-${child.id}`,
          source: data.id,
          target: child.id,
          type: 'smoothstep'
        });
      }
    });
  } else {
    data.children?.forEach((division, index) => {
      nodes.push({
        id: `${division.type}-${division.id}`,
        type: 'baseNode',
        position: { x: offset * (index - 2), y: layerOffset },
        data: { label: division.name }
      });
      edges.push({
        type: 'smoothstep',
        id: `e${data.id}-${division.id}`,
        source: data.id,
        target: `${division.type}-${division.id}`,
      });
    });
  }
  return { nodes, edges };
};

export default OrganizationChartVisualization;
