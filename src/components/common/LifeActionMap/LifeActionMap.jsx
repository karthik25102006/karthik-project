import React, { useState, useMemo } from 'react';
import Card from '../Card/Card';
import Badge from '../Badge/Badge';
import './LifeActionMap.css';

/**
 * Life Action Map Component (Stage 5 Feature)
 * 
 * An interactive, 5-phase structured action checklist derived directly
 * from the verified document explanation:
 * 1. Understand
 * 2. Identify
 * 3. Prepare
 * 4. Act
 * 5. Verify
 */
export function LifeActionMap({ explanation, isTelugu = false, documentTitle = 'Document' }) {
  const [activePhase, setActivePhase] = useState('all');
  const [completedTasks, setCompletedTasks] = useState({});

  // 5 standard phases metadata
  const phases = useMemo(() => [
    {
      id: 'understand',
      number: 1,
      icon: '🧠',
      nameEn: 'Understand',
      nameTe: 'అర్థం చేసుకోండి',
      descEn: 'Grasp the core notice purpose and why it applies to you',
      descTe: 'నోటీసు యొక్క ముఖ్య ఉద్దేశ్యం మరియు ఇది మీకు ఎందుకు వర్తిస్తుందో తెలుసుకోండి',
    },
    {
      id: 'identify',
      number: 2,
      icon: '🔍',
      nameEn: 'Identify',
      nameTe: 'గుర్తించండి',
      descEn: 'Pinpoint crucial dates, deadlines, fees, and eligibility conditions',
      descTe: 'ముఖ్యమైన తేదీలు, గడువులు, ఫీజులు మరియు అర్హతలను గుర్తించండి',
    },
    {
      id: 'prepare',
      number: 3,
      icon: '📂',
      nameEn: 'Prepare',
      nameTe: 'సిద్ధం చేసుకోండి',
      descEn: 'Gather required certificates, records, and identity proofs',
      descTe: 'అవసరమైన ఆధార్, బ్యాంక్ పాస్‌బుక్, సర్టిఫికెట్లను సిద్ధం చేసుకోండి',
    },
    {
      id: 'act',
      number: 4,
      icon: '⚡',
      nameEn: 'Act',
      nameTe: 'చర్య తీసుకోండి',
      descEn: 'Execute concrete submission or attendance steps before cutoffs',
      descTe: 'గడువు లోపు దరఖాస్తు సమర్పణ లేదా కార్యాలయ సందర్శన పూర్తి చేయండి',
    },
    {
      id: 'verify',
      number: 5,
      icon: '✅',
      nameEn: 'Verify',
      nameTe: 'నిర్ధారించుకోండి',
      descEn: 'Obtain acknowledgement slips, track status, and verify with authorities',
      descTe: 'రసీదు పొందండి, ఎస్ఎంఎస్ తనిఖీ చేయండి మరియు అధికారికంగా సరిచూసుకోండి',
    },
  ], []);

  // Normalize / synthesize the 5 phases from the structured explanation
  const actionItemsByPhase = useMemo(() => {
    const rawMap = explanation?.actionMap || {};
    const items = {
      understand: [],
      identify: [],
      prepare: [],
      act: [],
      verify: [],
    };

    // 1. Understand items
    if (Array.isArray(rawMap.understand) && rawMap.understand.length > 0) {
      items.understand = rawMap.understand;
    } else {
      if (explanation?.summary?.whatIsIt) {
        items.understand.push({
          id: 'u-1',
          title: isTelugu ? 'పత్రం ప్రాథమిక ఉద్దేశ్యాన్ని చదవండి' : 'Read Document Core Purpose',
          detail: explanation.summary.whatIsIt,
          sourceQuote: explanation.summary.mainPurpose || null,
        });
      }
      if (explanation?.summary?.whyItMatters) {
        items.understand.push({
          id: 'u-2',
          title: isTelugu ? 'ఇది మీకు ఎందుకు ముఖ్యమో తెలుసుకోండి' : 'Understand Why This Matters to You',
          detail: explanation.summary.whyItMatters,
          sourceQuote: null,
        });
      }
    }

    // 2. Identify items
    if (Array.isArray(rawMap.identify) && rawMap.identify.length > 0) {
      items.identify = rawMap.identify;
    } else {
      // Add dates from importantDates
      if (Array.isArray(explanation?.importantDates)) {
        explanation.importantDates.forEach((d, idx) => {
          items.identify.push({
            id: `i-date-${idx}`,
            title: `${d.type || 'Date'}: ${d.date}`,
            detail: d.description,
            sourceQuote: d.sourceQuote || null,
          });
        });
      }
      // Add fees/amounts if specified
      if (Array.isArray(explanation?.importantInformation)) {
        const feeInfo = explanation.importantInformation.find(
          (i) => i.label?.toLowerCase().includes('fee') || i.label?.toLowerCase().includes('amount')
        );
        if (feeInfo && feeInfo.value && !feeInfo.value.toLowerCase().includes('not specified')) {
          items.identify.push({
            id: 'i-fee',
            title: isTelugu ? 'రుసుము / మొత్తం వివరాలు' : 'Fees & Monetary Amounts',
            detail: feeInfo.value,
            sourceQuote: null,
          });
        }
      }
    }

    // 3. Prepare items
    if (Array.isArray(rawMap.prepare) && rawMap.prepare.length > 0) {
      items.prepare = rawMap.prepare;
    } else {
      if (Array.isArray(explanation?.importantInformation)) {
        const docsInfo = explanation.importantInformation.find(
          (i) => i.label?.toLowerCase().includes('document')
        );
        if (docsInfo && docsInfo.value && !docsInfo.value.toLowerCase().includes('not specified')) {
          items.prepare.push({
            id: 'p-docs',
            title: isTelugu ? 'అవసరమైన పత్రాలను సేకరించండి' : 'Gather Required Certificates & Records',
            detail: docsInfo.value,
            sourceQuote: null,
          });
        }
      }
      if (Array.isArray(explanation?.requirementsAndConditions)) {
        explanation.requirementsAndConditions.forEach((req, idx) => {
          items.prepare.push({
            id: `p-req-${idx}`,
            title: req.condition,
            detail: req.details,
            sourceQuote: null,
          });
        });
      }
    }

    // 4. Act items
    if (Array.isArray(rawMap.act) && rawMap.act.length > 0) {
      items.act = rawMap.act;
    } else {
      if (Array.isArray(explanation?.suggestedNextSteps)) {
        explanation.suggestedNextSteps.forEach((s, idx) => {
          items.act.push({
            id: `a-step-${idx}`,
            title: s.action,
            detail: `${s.reason}${s.deadline && s.deadline !== 'Not specified' ? ` (Deadline: ${s.deadline})` : ''}`,
            sourceQuote: s.verificationNeeded ? `Verification note: ${s.verificationNeeded}` : null,
          });
        });
      }
    }

    // 5. Verify items
    if (Array.isArray(rawMap.verify) && rawMap.verify.length > 0) {
      items.verify = rawMap.verify;
    } else {
      items.verify.push({
        id: 'v-ack',
        title: isTelugu ? 'అధికారిక రసీదు లేదా SMS నిర్ధారణ పొందండి' : 'Obtain Official Receipt or SMS Confirmation',
        detail: isTelugu
          ? 'దరఖాస్తు సమర్పించిన తర్వాత భవిష్యత్ ప్రయోజనాల కోసం దరఖాస్తు నంబర్ మరియు రసీదు కాపీని భద్రపరుచుకోండి.'
          : 'Retain acknowledgement receipt, application reference number, or SMS confirmation for future tracking.',
        sourceQuote: null,
      });

      if (Array.isArray(explanation?.whatIsUnclear) && explanation.whatIsUnclear.length > 0) {
        items.verify.push({
          id: 'v-unclear',
          title: isTelugu ? 'పత్రంలో అస్పష్టంగా ఉన్న అంశాలను నిర్ధారించండి' : 'Confirm Ambiguous Document Points',
          detail: explanation.whatIsUnclear.join('; '),
          sourceQuote: null,
        });
      }
    }

    return items;
  }, [explanation, isTelugu]);

  // Flattened items for progress calculation
  const allItems = useMemo(() => {
    return Object.values(actionItemsByPhase).flat();
  }, [actionItemsByPhase]);

  const totalCount = allItems.length;
  const completedCount = allItems.filter((item) => completedTasks[item.id]).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleTask = (id) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleResetChecklist = () => {
    setCompletedTasks({});
  };

  return (
    <Card variant="default" padding="lg" className="lt-action-map-card">
      {/* Header Banner */}
      <div className="lt-action-map__header">
        <div className="lt-action-map__title-group">
          <div className="lt-action-map__icon-wrap" aria-hidden="true">🗺️</div>
          <div>
            <div className="lt-action-map__badge-row">
              <Badge variant="primary">
                {isTelugu ? 'దశ 5: లైఫ్ యాక్షన్ మ్యాప్' : 'Stage 5: Life Action Map'}
              </Badge>
              <Badge variant="success">
                {isTelugu ? 'పత్రం ఆధారిత చర్యల చెక్‌లిస్ట్' : '100% Grounded in Document'}
              </Badge>
            </div>
            <h3 className="lt-action-map__title">
              {isTelugu ? 'పత్రం కార్యాచరణ ప్రణాళిక (5 దశల చెక్‌లిస్ట్)' : 'Document Life Action Map (5-Phase Checklist)'}
            </h3>
            <p className="lt-action-map__subtitle">
              {isTelugu
                ? 'మీ పత్రంలోని నిజమైన అంశాల ఆధారంగా రూపొందించిన చర్యల జాబితా. మీరు పూర్తి చేసిన వాటిని టిక్ చేసుకోండి.'
                : `Interactive roadmap based strictly on verified facts in "${documentTitle}". Check off items as you complete them.`}
            </p>
          </div>
        </div>

        {/* Overall Progress Meter */}
        <div className="lt-action-map__progress-card">
          <div className="lt-action-map__progress-header">
            <span className="lt-action-map__progress-label">
              {isTelugu ? 'పూర్తయిన చర్యలు' : 'Checklist Progress'}
            </span>
            <span className="lt-action-map__progress-val">
              {completedCount} / {totalCount} ({progressPercent}%)
            </span>
          </div>
          <div className="lt-action-map__progress-bar-track" role="progressbar" aria-valuenow={progressPercent} aria-valuemin="0" aria-valuemax="100">
            <div
              className="lt-action-map__progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          {completedCount > 0 && (
            <button
              type="button"
              className="lt-action-map__reset-btn"
              onClick={handleResetChecklist}
            >
              🔄 {isTelugu ? 'రీసెట్ చేయండి' : 'Reset Checkmarks'}
            </button>
          )}
        </div>
      </div>

      {/* Phase Selector Tabs */}
      <div className="lt-phase-tabs" role="tablist" aria-label="Action Map Phases">
        <button
          type="button"
          role="tab"
          aria-selected={activePhase === 'all'}
          className={`lt-phase-tab ${activePhase === 'all' ? 'lt-phase-tab--active' : ''}`}
          onClick={() => setActivePhase('all')}
        >
          <span>🌐</span>
          <span>{isTelugu ? 'అన్ని దశలు' : 'All Phases'} ({totalCount})</span>
        </button>

        {phases.map((ph) => {
          const phItems = actionItemsByPhase[ph.id] || [];
          const phCompleted = phItems.filter((i) => completedTasks[i.id]).length;
          return (
            <button
              key={ph.id}
              type="button"
              role="tab"
              aria-selected={activePhase === ph.id}
              className={`lt-phase-tab ${activePhase === ph.id ? 'lt-phase-tab--active' : ''}`}
              onClick={() => setActivePhase(ph.id)}
            >
              <span>{ph.icon}</span>
              <span>{ph.number}. {isTelugu ? ph.nameTe : ph.nameEn}</span>
              <span className="lt-phase-tab__count">
                {phCompleted}/{phItems.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Action Items List */}
      <div className="lt-action-phases-container">
        {phases
          .filter((ph) => activePhase === 'all' || activePhase === ph.id)
          .map((ph) => {
            const items = actionItemsByPhase[ph.id] || [];
            if (items.length === 0) return null;

            return (
              <div key={ph.id} className="lt-phase-group">
                <div className="lt-phase-group__header">
                  <div className="lt-phase-group__title-col">
                    <span className="lt-phase-group__icon" aria-hidden="true">{ph.icon}</span>
                    <div>
                      <h4 className="lt-phase-group__title">
                        {ph.number}. {isTelugu ? ph.nameTe : ph.nameEn}
                      </h4>
                      <p className="lt-phase-group__desc">
                        {isTelugu ? ph.descTe : ph.descEn}
                      </p>
                    </div>
                  </div>
                  <span className="lt-phase-group__badge">
                    {items.filter((i) => completedTasks[i.id]).length} / {items.length} {isTelugu ? 'పూర్తయ్యాయి' : 'done'}
                  </span>
                </div>

                <div className="lt-phase-group__items">
                  {items.map((item) => {
                    const isDone = !!completedTasks[item.id];
                    return (
                      <label
                        key={item.id}
                        className={`lt-action-item ${isDone ? 'lt-action-item--done' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => toggleTask(item.id)}
                          className="lt-action-item__checkbox"
                        />
                        <div className="lt-action-item__body">
                          <div className="lt-action-item__title-row">
                            <span className="lt-action-item__title">{item.title}</span>
                            {isDone && (
                              <span className="lt-action-item__done-tag">
                                ✓ {isTelugu ? 'పూర్తయింది' : 'Completed'}
                              </span>
                            )}
                          </div>
                          {item.detail && (
                            <p className="lt-action-item__detail">{item.detail}</p>
                          )}
                          {item.sourceQuote && (
                            <div className="lt-action-item__quote">
                              <span className="lt-action-item__quote-label">
                                {isTelugu ? 'పత్రం ఆధారం:' : 'Document Source:'}
                              </span>{' '}
                              "{item.sourceQuote}"
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {/* Completion Toast */}
      {progressPercent === 100 && totalCount > 0 && (
        <div className="lt-action-map__celebration" role="alert">
          <span className="lt-celebration-icon" aria-hidden="true">🎉</span>
          <div>
            <strong>{isTelugu ? 'అభినందనలు! అన్ని చర్యలు పూర్తయ్యాయి!' : 'Outstanding! All Checklist Actions Completed!'}</strong>
            <p>
              {isTelugu
                ? 'మీరు మీ పత్రంలోని ముఖ్యమైన తేదీలు, పత్రాల సేకరణ మరియు సమర్పణ చర్యలను సమీక్షించారు.'
                : 'You have verified all dates, gathered necessary documents, and fulfilled all required actions according to the notice.'}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}

export default LifeActionMap;
