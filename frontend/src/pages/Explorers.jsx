import React from 'react';
import { Tag, Typography, Descriptions } from 'antd';
import SharedExplorer from '../components/SharedExplorer';

const { Text: AntText } = Typography;

const safeRenderTags = (data, color = '#5e6ad2') => {
  if (!data || data.length === 0) return <AntText type="secondary">N/A</AntText>;
  
  let items = Array.isArray(data) ? data : typeof data === 'string' && data.includes(',') ? data.split(',') : [data];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {items.map((item, index) => {
        const label = typeof item === 'object' ? (item.name || item.id || 'Unknown') : item.trim();
        return <Tag key={index} style={{ background: 'transparent', border: `1px solid ${color}`, color: color }}>{label}</Tag>;
      })}
    </div>
  );
};

// --- 1. Drug Explorer ---
export const DrugExplorer = () => {
  const columns = [
    { title: 'Drug ID', dataIndex: 'id', key: 'id', render: text => <AntText code style={{ background: 'rgba(255,255,255,0.05)', color: '#c9d1d9', borderColor: '#30363d' }}>{text}</AntText> },
    { title: 'Drug Name', dataIndex: 'name', key: 'name', render: text => <AntText strong style={{ color: '#5e6ad2' }}>{text}</AntText> },
    { title: 'Class', dataIndex: 'class', key: 'class', render: text => <AntText style={{ color: '#c9d1d9' }}>{text || 'N/A'}</AntText> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: text => text ? <Tag style={{ background: 'transparent', border: `1px solid ${text.includes('Approved') || text.includes('Verified') ? '#2ea043' : '#d29922'}`, color: text.includes('Approved') || text.includes('Verified') ? '#2ea043' : '#d29922' }}>{text}</Tag> : <AntText type="secondary">N/A</AntText> },
    { title: 'Targets', dataIndex: 'targets', key: 'targets', render: targets => safeRenderTags(targets, '#8957e5') },
  ];

  const detailLayout = (entity) => (
    <>
      <Descriptions.Item label="Drug ID"><AntText code style={{ color: '#c9d1d9', background: 'transparent' }}>{entity.id}</AntText></Descriptions.Item>
      <Descriptions.Item label="Name"><AntText style={{ color: '#c9d1d9' }}>{entity.name}</AntText></Descriptions.Item>
      <Descriptions.Item label="Drug Class"><AntText style={{ color: '#c9d1d9' }}>{entity.class || 'N/A'}</AntText></Descriptions.Item>
      <Descriptions.Item label="FDA Status">{entity.status ? <Tag style={{ background: 'transparent', borderColor: '#2ea043', color: '#2ea043' }}>{entity.status}</Tag> : 'N/A'}</Descriptions.Item>
      <Descriptions.Item label="Mechanism / Targets">{safeRenderTags(entity.targets, '#8957e5')}</Descriptions.Item>
    </>
  );

  return <SharedExplorer title="Drug Explorer" subtitle="Search and filter pharmaceutical compounds and targeted therapies." endpoint="explore/drugs" columns={columns} detailLayout={detailLayout} />;
};

// --- 2. Gene Explorer ---
export const GeneExplorer = () => {
  const columns = [
    { title: 'Gene Symbol', dataIndex: 'name', key: 'name', render: text => <AntText strong style={{ color: '#5e6ad2' }}>{text}</AntText> },
    { title: 'HGNC ID', dataIndex: 'id', key: 'id', render: text => <AntText code style={{ background: 'rgba(255,255,255,0.05)', color: '#c9d1d9', borderColor: '#30363d' }}>{text}</AntText> },
    { title: 'Chromosome', dataIndex: 'chromosome', key: 'chromosome', render: text => <AntText style={{ color: '#c9d1d9' }}>{text || 'N/A'}</AntText> },
    { title: 'Gene Type', dataIndex: 'type', key: 'type', render: text => text || <AntText type="secondary">N/A</AntText> },
  ];

  const detailLayout = (entity) => (
    <>
      <Descriptions.Item label="Symbol"><AntText style={{ color: '#c9d1d9' }}>{entity.name}</AntText></Descriptions.Item>
      <Descriptions.Item label="HGNC ID"><AntText code style={{ color: '#c9d1d9', background: 'transparent' }}>{entity.id}</AntText></Descriptions.Item>
      <Descriptions.Item label="Locus"><AntText style={{ color: '#c9d1d9' }}>{entity.chromosome || 'N/A'}</AntText></Descriptions.Item>
      <Descriptions.Item label="Type">{entity.type ? <Tag style={{ background: 'transparent', borderColor: '#5e6ad2', color: '#5e6ad2' }}>{entity.type}</Tag> : 'N/A'}</Descriptions.Item>
    </>
  );

  return <SharedExplorer title="Gene Explorer" subtitle="Analyze oncogenes, tumor suppressors, and biomarkers." endpoint="explore/genes" columns={columns} detailLayout={detailLayout} />;
};

// --- 3. Mutation Explorer ---
export const MutationExplorer = () => {
  const columns = [
    { title: 'Variant', dataIndex: 'name', key: 'name', render: text => <AntText strong style={{ color: '#d29922' }}>{text}</AntText> },
    { title: 'dbSNP ID', dataIndex: 'id', key: 'id', render: text => <AntText code style={{ background: 'rgba(255,255,255,0.05)', color: '#c9d1d9', borderColor: '#30363d' }}>{text}</AntText> },
    { title: 'Gene', dataIndex: 'gene', key: 'gene', render: gene => safeRenderTags(gene, '#5e6ad2') },
    { title: 'Significance', dataIndex: 'clinical_significance', key: 'clinical_significance', render: text => text ? <Tag style={{ background: 'transparent', borderColor: '#f85149', color: '#f85149' }}>{text}</Tag> : <AntText type="secondary">N/A</AntText> },
  ];

  const detailLayout = (entity) => (
    <>
      <Descriptions.Item label="Variant Name"><AntText style={{ color: '#c9d1d9' }}>{entity.name}</AntText></Descriptions.Item>
      <Descriptions.Item label="dbSNP ID"><AntText code style={{ color: '#c9d1d9', background: 'transparent' }}>{entity.id}</AntText></Descriptions.Item>
      <Descriptions.Item label="Associated Gene">{safeRenderTags(entity.gene, '#5e6ad2')}</Descriptions.Item>
      <Descriptions.Item label="Significance">{entity.clinical_significance ? <Tag style={{ background: 'transparent', borderColor: '#f85149', color: '#f85149' }}>{entity.clinical_significance}</Tag> : 'N/A'}</Descriptions.Item>
      <Descriptions.Item label="Resistance Profile">{safeRenderTags(entity.drug_resistance, '#f85149')}</Descriptions.Item>
    </>
  );

  return <SharedExplorer title="Mutation Explorer" subtitle="Investigate actionable somatic mutations and resistance mechanisms." endpoint="explore/mutations" columns={columns} detailLayout={detailLayout} />;
};

// --- 4. Clinical Trials ---
export const ClinicalTrials = () => {
  const columns = [
    { title: 'NCT ID', dataIndex: 'id', key: 'id', render: text => <AntText code style={{ background: 'rgba(255,255,255,0.05)', color: '#c9d1d9', borderColor: '#30363d' }}>{text}</AntText> },
    { title: 'Title', dataIndex: 'title', key: 'title', width: '40%', render: text => <AntText style={{ color: '#c9d1d9' }}>{text}</AntText> },
    { title: 'Phase', dataIndex: 'phase', key: 'phase', render: text => text ? <Tag style={{ background: 'transparent', borderColor: '#8957e5', color: '#8957e5' }}>{text}</Tag> : <AntText type="secondary">N/A</AntText> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: text => <AntText style={{ color: '#8b949e' }}>{text || 'N/A'}</AntText> },
  ];

  const detailLayout = (entity) => (
    <>
      <Descriptions.Item label="NCT ID"><AntText code style={{ color: '#c9d1d9', background: 'transparent' }}>{entity.id}</AntText></Descriptions.Item>
      <Descriptions.Item label="Trial Title"><AntText style={{ color: '#c9d1d9' }}>{entity.title}</AntText></Descriptions.Item>
      <Descriptions.Item label="Phase">{entity.phase ? <Tag style={{ background: 'transparent', borderColor: '#8957e5', color: '#8957e5' }}>{entity.phase}</Tag> : 'N/A'}</Descriptions.Item>
      <Descriptions.Item label="Status"><AntText style={{ color: '#8b949e' }}>{entity.status || 'N/A'}</AntText></Descriptions.Item>
      <Descriptions.Item label="Target Disease">{safeRenderTags(entity.disease, '#f85149')}</Descriptions.Item>
    </>
  );

  return <SharedExplorer title="Clinical Trials" subtitle="Track active oncology clinical trials and trial outcomes." endpoint="explore/trials" columns={columns} detailLayout={detailLayout} />;
};

// --- 5. Publications ---
export const Publications = () => {
  const columns = [
    { title: 'PMID', dataIndex: 'id', key: 'id', render: text => <AntText code style={{ background: 'rgba(255,255,255,0.05)', color: '#c9d1d9', borderColor: '#30363d' }}>{text}</AntText> },
    { title: 'Paper Title', dataIndex: 'title', key: 'title', width: '50%', render: text => <AntText style={{ color: '#c9d1d9' }}>{text}</AntText> },
    { title: 'Journal', dataIndex: 'journal', key: 'journal', render: text => text ? <AntText italic style={{ color: '#8b949e' }}>{text}</AntText> : <AntText type="secondary">N/A</AntText> },
    { title: 'Year', dataIndex: 'year', key: 'year', render: text => <AntText style={{ color: '#c9d1d9' }}>{text}</AntText> },
  ];

  const detailLayout = (entity) => {
    const renderAuthors = () => {
      if (!entity.authors) return <AntText type="secondary">N/A</AntText>;
      const authorsList = Array.isArray(entity.authors) ? entity.authors.join(', ') : entity.authors;
      return <AntText style={{ color: '#c9d1d9' }}>{authorsList}</AntText>;
    };

    return (
      <>
        <Descriptions.Item label="PMID"><AntText code style={{ color: '#c9d1d9', background: 'transparent' }}>{entity.id}</AntText></Descriptions.Item>
        <Descriptions.Item label="Title"><AntText style={{ color: '#c9d1d9' }}>{entity.title}</AntText></Descriptions.Item>
        <Descriptions.Item label="Journal">{entity.journal ? <AntText italic style={{ color: '#8b949e' }}>{entity.journal}</AntText> : 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Year"><AntText style={{ color: '#c9d1d9' }}>{entity.year || 'N/A'}</AntText></Descriptions.Item>
        <Descriptions.Item label="Authors">{renderAuthors()}</Descriptions.Item>
      </>
    );
  };

  return <SharedExplorer title="Publications" subtitle="Query indexed biomedical literature and supporting evidence." endpoint="explore/publications" columns={columns} detailLayout={detailLayout} />;
};