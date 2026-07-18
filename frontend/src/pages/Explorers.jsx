import React from 'react';
import { Tag, Typography, Descriptions, Space } from 'antd';
import SharedExplorer from '../components/SharedExplorer';

const { Text: AntText } = Typography;

// 🛠️ CTO FIX: Universal Array/Object rendering helper
const safeRenderTags = (data, color = 'blue') => {
  if (!data || data.length === 0) return <AntText type="secondary">N/A</AntText>;
  
  // Convert to array if it's a comma-separated string
  let items = Array.isArray(data) ? data : typeof data === 'string' && data.includes(',') ? data.split(',') : [data];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
      {items.map((item, index) => {
        const label = typeof item === 'object' ? (item.name || item.id || 'Unknown') : item.trim();
        return <Tag key={index} color={color}>{label}</Tag>;
      })}
    </div>
  );
};

// --- 1. Drug Explorer ---
export const DrugExplorer = () => {
  const columns = [
    { title: 'Drug ID', dataIndex: 'id', key: 'id', render: text => <AntText code>{text}</AntText> },
    { title: 'Drug Name', dataIndex: 'name', key: 'name', render: text => <AntText strong style={{ color: '#00B5AD' }}>{text}</AntText> },
    { title: 'Class', dataIndex: 'class', key: 'class', render: text => text || <AntText type="secondary">N/A</AntText> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: text => text ? <Tag color={text.includes('Approved') || text.includes('Verified') ? 'success' : 'processing'}>{text}</Tag> : <AntText type="secondary">N/A</AntText> },
    // ✅ FIX: Using safeRenderTags for the targets array
    { title: 'Targets', dataIndex: 'targets', key: 'targets', render: targets => safeRenderTags(targets, 'cyan') },
  ];

  const detailLayout = (entity) => (
    <>
      <Descriptions.Item label="Drug ID"><AntText code>{entity.id}</AntText></Descriptions.Item>
      <Descriptions.Item label="Name">{entity.name}</Descriptions.Item>
      <Descriptions.Item label="Drug Class">{entity.class || 'N/A'}</Descriptions.Item>
      <Descriptions.Item label="FDA Status">{entity.status ? <Tag color="success">{entity.status}</Tag> : 'N/A'}</Descriptions.Item>
      {/* ✅ FIX: Applied to expanded view as well */}
      <Descriptions.Item label="Mechanism / Targets">{safeRenderTags(entity.targets, 'cyan')}</Descriptions.Item>
    </>
  );

  return <SharedExplorer title="Drug Explorer" subtitle="Search and filter pharmaceutical compounds and targeted therapies." endpoint="explore/drugs" columns={columns} detailLayout={detailLayout} />;
};

// --- 2. Gene Explorer ---
export const GeneExplorer = () => {
  const columns = [
    { title: 'Gene Symbol', dataIndex: 'name', key: 'name', render: text => <AntText strong style={{ color: '#1890ff' }}>{text}</AntText> },
    { title: 'HGNC ID', dataIndex: 'id', key: 'id', render: text => <AntText code>{text}</AntText> },
    { title: 'Chromosome', dataIndex: 'chromosome', key: 'chromosome', render: text => text || <AntText type="secondary">N/A</AntText> },
    { title: 'Gene Type', dataIndex: 'type', key: 'type', render: text => text || <AntText type="secondary">N/A</AntText> },
  ];

  const detailLayout = (entity) => (
    <>
      <Descriptions.Item label="Symbol">{entity.name}</Descriptions.Item>
      <Descriptions.Item label="HGNC ID"><AntText code>{entity.id}</AntText></Descriptions.Item>
      <Descriptions.Item label="Locus">{entity.chromosome || 'N/A'}</Descriptions.Item>
      <Descriptions.Item label="Type">{entity.type ? <Tag color="geekblue">{entity.type}</Tag> : 'N/A'}</Descriptions.Item>
    </>
  );

  return <SharedExplorer title="Gene Explorer" subtitle="Analyze oncogenes, tumor suppressors, and biomarkers." endpoint="explore/genes" columns={columns} detailLayout={detailLayout} />;
};

// --- 3. Mutation Explorer ---
export const MutationExplorer = () => {
  const columns = [
    { title: 'Variant', dataIndex: 'name', key: 'name', render: text => <AntText strong style={{ color: '#faad14' }}>{text}</AntText> },
    { title: 'dbSNP ID', dataIndex: 'id', key: 'id', render: text => <AntText code>{text}</AntText> },
    { title: 'Gene', dataIndex: 'gene', key: 'gene', render: gene => safeRenderTags(gene, 'blue') },
    { title: 'Significance', dataIndex: 'clinical_significance', key: 'clinical_significance', render: text => text ? <Tag color="volcano">{text}</Tag> : <AntText type="secondary">N/A</AntText> },
  ];

  const detailLayout = (entity) => (
    <>
      <Descriptions.Item label="Variant Name">{entity.name}</Descriptions.Item>
      <Descriptions.Item label="dbSNP ID"><AntText code>{entity.id}</AntText></Descriptions.Item>
      <Descriptions.Item label="Associated Gene">{safeRenderTags(entity.gene, 'blue')}</Descriptions.Item>
      <Descriptions.Item label="Significance">{entity.clinical_significance ? <Tag color="volcano">{entity.clinical_significance}</Tag> : 'N/A'}</Descriptions.Item>
      <Descriptions.Item label="Resistance Profile">{safeRenderTags(entity.drug_resistance, 'red')}</Descriptions.Item>
    </>
  );

  return <SharedExplorer title="Mutation Explorer" subtitle="Investigate actionable somatic mutations and resistance mechanisms." endpoint="explore/mutations" columns={columns} detailLayout={detailLayout} />;
};

// --- 4. Clinical Trials ---
export const ClinicalTrials = () => {
  const columns = [
    { title: 'NCT ID', dataIndex: 'id', key: 'id', render: text => <AntText code>{text}</AntText> },
    { title: 'Title', dataIndex: 'title', key: 'title', width: '40%' },
    { title: 'Phase', dataIndex: 'phase', key: 'phase', render: text => text ? <Tag color="purple">{text}</Tag> : <AntText type="secondary">N/A</AntText> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: text => text || <AntText type="secondary">N/A</AntText> },
  ];

  const detailLayout = (entity) => (
    <>
      <Descriptions.Item label="NCT ID"><AntText code>{entity.id}</AntText></Descriptions.Item>
      <Descriptions.Item label="Trial Title">{entity.title}</Descriptions.Item>
      <Descriptions.Item label="Phase">{entity.phase ? <Tag color="purple">{entity.phase}</Tag> : 'N/A'}</Descriptions.Item>
      <Descriptions.Item label="Status">{entity.status || 'N/A'}</Descriptions.Item>
      <Descriptions.Item label="Target Disease">{safeRenderTags(entity.disease, 'magenta')}</Descriptions.Item>
    </>
  );

  return <SharedExplorer title="Clinical Trials" subtitle="Track active oncology clinical trials and trial outcomes." endpoint="explore/trials" columns={columns} detailLayout={detailLayout} />;
};

// --- 5. Publications ---
export const Publications = () => {
  const columns = [
    { title: 'PMID', dataIndex: 'id', key: 'id', render: text => <AntText code>{text}</AntText> },
    { title: 'Paper Title', dataIndex: 'title', key: 'title', width: '50%' },
    { title: 'Journal', dataIndex: 'journal', key: 'journal', render: text => text ? <AntText italic>{text}</AntText> : <AntText type="secondary">N/A</AntText> },
    { title: 'Year', dataIndex: 'year', key: 'year' },
  ];

  const detailLayout = (entity) => {
    // Authors can be huge arrays. Join them gracefully.
    const renderAuthors = () => {
      if (!entity.authors) return <AntText type="secondary">N/A</AntText>;
      const authorsList = Array.isArray(entity.authors) ? entity.authors.join(', ') : entity.authors;
      return <AntText>{authorsList}</AntText>;
    };

    return (
      <>
        <Descriptions.Item label="PMID"><AntText code>{entity.id}</AntText></Descriptions.Item>
        <Descriptions.Item label="Title">{entity.title}</Descriptions.Item>
        <Descriptions.Item label="Journal">{entity.journal ? <AntText italic>{entity.journal}</AntText> : 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Year">{entity.year || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Authors">{renderAuthors()}</Descriptions.Item>
      </>
    );
  };

  return <SharedExplorer title="Publications" subtitle="Query indexed biomedical literature and supporting evidence." endpoint="explore/publications" columns={columns} detailLayout={detailLayout} />;
};