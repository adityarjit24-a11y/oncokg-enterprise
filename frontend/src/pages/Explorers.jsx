import React from 'react';
import { Tag, Typography, Descriptions } from 'antd';
import SharedExplorer from '../components/SharedExplorer';

// ✅ FIX: Text ko rename karke AntText kar diya hai
const { Text: AntText } = Typography;

// --- 1. Drug Explorer ---
export const DrugExplorer = () => {
  const columns = [
    { title: 'Drug ID', dataIndex: 'id', key: 'id', render: text => <AntText code>{text}</AntText> },
    { title: 'Drug Name', dataIndex: 'name', key: 'name', render: text => <AntText strong style={{ color: '#00B5AD' }}>{text}</AntText> },
    { title: 'Class', dataIndex: 'class', key: 'class' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: text => <Tag color={text.includes('Approved') ? 'success' : 'processing'}>{text}</Tag> },
    { title: 'Targets', dataIndex: 'targets', key: 'targets' },
  ];

  const detailLayout = (entity) => (
    <>
      <Descriptions.Item label="Drug ID"><AntText code>{entity.id}</AntText></Descriptions.Item>
      <Descriptions.Item label="Name">{entity.name}</Descriptions.Item>
      <Descriptions.Item label="Drug Class">{entity.class}</Descriptions.Item>
      <Descriptions.Item label="FDA Status"><Tag color="success">{entity.status}</Tag></Descriptions.Item>
      <Descriptions.Item label="Mechanism / Targets">{entity.targets}</Descriptions.Item>
    </>
  );

  return <SharedExplorer title="Drug Explorer" subtitle="Search and filter pharmaceutical compounds and targeted therapies." endpoint="explore/drugs" columns={columns} detailLayout={detailLayout} />;
};

// --- 2. Gene Explorer ---
export const GeneExplorer = () => {
  const columns = [
    { title: 'Gene Symbol', dataIndex: 'name', key: 'name', render: text => <AntText strong style={{ color: '#1890ff' }}>{text}</AntText> },
    { title: 'HGNC ID', dataIndex: 'id', key: 'id', render: text => <AntText code>{text}</AntText> },
    { title: 'Chromosome', dataIndex: 'chromosome', key: 'chromosome' },
    { title: 'Gene Type', dataIndex: 'type', key: 'type' },
  ];

  const detailLayout = (entity) => (
    <>
      <Descriptions.Item label="Symbol">{entity.name}</Descriptions.Item>
      <Descriptions.Item label="HGNC ID"><AntText code>{entity.id}</AntText></Descriptions.Item>
      <Descriptions.Item label="Locus">{entity.chromosome}</Descriptions.Item>
      <Descriptions.Item label="Type">{entity.type}</Descriptions.Item>
    </>
  );

  return <SharedExplorer title="Gene Explorer" subtitle="Analyze oncogenes, tumor suppressors, and biomarkers." endpoint="explore/genes" columns={columns} detailLayout={detailLayout} />;
};

// --- 3. Mutation Explorer ---
export const MutationExplorer = () => {
  const columns = [
    { title: 'Variant', dataIndex: 'name', key: 'name', render: text => <AntText strong style={{ color: '#faad14' }}>{text}</AntText> },
    { title: 'dbSNP ID', dataIndex: 'id', key: 'id', render: text => <AntText code>{text}</AntText> },
    { title: 'Gene', dataIndex: 'gene', key: 'gene' },
    { title: 'Significance', dataIndex: 'clinical_significance', key: 'clinical_significance', render: text => <Tag color="volcano">{text}</Tag> },
  ];

  const detailLayout = (entity) => (
    <>
      <Descriptions.Item label="Variant Name">{entity.name}</Descriptions.Item>
      <Descriptions.Item label="dbSNP ID"><AntText code>{entity.id}</AntText></Descriptions.Item>
      <Descriptions.Item label="Associated Gene">{entity.gene}</Descriptions.Item>
      <Descriptions.Item label="Significance"><Tag color="volcano">{entity.clinical_significance}</Tag></Descriptions.Item>
      <Descriptions.Item label="Resistance Profile">{entity.drug_resistance}</Descriptions.Item>
    </>
  );

  return <SharedExplorer title="Mutation Explorer" subtitle="Investigate actionable somatic mutations and resistance mechanisms." endpoint="explore/mutations" columns={columns} detailLayout={detailLayout} />;
};

// --- 4. Clinical Trials ---
export const ClinicalTrials = () => {
  const columns = [
    { title: 'NCT ID', dataIndex: 'id', key: 'id', render: text => <AntText code>{text}</AntText> },
    { title: 'Title', dataIndex: 'title', key: 'title', width: '40%' },
    { title: 'Phase', dataIndex: 'phase', key: 'phase', render: text => <Tag color="purple">{text}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  const detailLayout = (entity) => (
    <>
      <Descriptions.Item label="NCT ID"><AntText code>{entity.id}</AntText></Descriptions.Item>
      <Descriptions.Item label="Trial Title">{entity.title}</Descriptions.Item>
      <Descriptions.Item label="Phase"><Tag color="purple">{entity.phase}</Tag></Descriptions.Item>
      <Descriptions.Item label="Status">{entity.status}</Descriptions.Item>
      <Descriptions.Item label="Target Disease">{entity.disease}</Descriptions.Item>
    </>
  );

  return <SharedExplorer title="Clinical Trials" subtitle="Track active oncology clinical trials and trial outcomes." endpoint="explore/trials" columns={columns} detailLayout={detailLayout} />;
};

// --- 5. Publications ---
export const Publications = () => {
  const columns = [
    { title: 'PMID', dataIndex: 'id', key: 'id', render: text => <AntText code>{text}</AntText> },
    { title: 'Paper Title', dataIndex: 'title', key: 'title', width: '50%' },
    { title: 'Journal', dataIndex: 'journal', key: 'journal', render: text => <AntText italic>{text}</AntText> },
    { title: 'Year', dataIndex: 'year', key: 'year' },
  ];

  const detailLayout = (entity) => (
    <>
      <Descriptions.Item label="PMID"><AntText code>{entity.id}</AntText></Descriptions.Item>
      <Descriptions.Item label="Title">{entity.title}</Descriptions.Item>
      <Descriptions.Item label="Journal"><AntText italic>{entity.journal}</AntText></Descriptions.Item>
      <Descriptions.Item label="Year">{entity.year}</Descriptions.Item>
      <Descriptions.Item label="Authors">{entity.authors}</Descriptions.Item>
    </>
  );

  return <SharedExplorer title="Publications" subtitle="Query indexed biomedical literature and supporting evidence." endpoint="explore/publications" columns={columns} detailLayout={detailLayout} />;
};