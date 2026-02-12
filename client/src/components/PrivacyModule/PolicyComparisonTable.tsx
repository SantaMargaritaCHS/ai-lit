import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { policyComparisons } from '@/data/policyComparisonData';
import { getCitation } from '@/data/privacyPolicyCitations';

interface PolicyComparisonTableProps {
  showCitations?: boolean;
}

export const PolicyComparisonTable: React.FC<PolicyComparisonTableProps> = ({
  showCitations = true
}) => {
  const [hoveredCitation, setHoveredCitation] = useState<number | null>(null);

  const renderCitationLink = (citationId: number) => {
    const citation = getCitation(citationId);
    if (!citation || !showCitations) return null;

    return (
      <span
        className="relative inline-block"
        onMouseEnter={() => setHoveredCitation(citationId)}
        onMouseLeave={() => setHoveredCitation(null)}
      >
        <sup className="text-blue-600 cursor-help hover:text-blue-500 ml-0.5">
          {citationId}
        </sup>
        {hoveredCitation === citationId && (
          <div className="absolute bottom-full left-0 mb-2 w-72 bg-white border-2 border-slate-300 rounded-lg p-3 shadow-xl z-50 text-xs">
            <p className="text-slate-900 font-semibold mb-1">{citation.title}</p>
            <p className="text-slate-600">{citation.organization}</p>
            <p className="text-blue-600 text-xs mt-1">{citation.accessed}</p>
          </div>
        )}
      </span>
    );
  };

  const renderMultipleCitations = (citationIds: number[]) => {
    return citationIds.map((id, index) => (
      <React.Fragment key={id}>
        {renderCitationLink(id)}
        {index < citationIds.length - 1 && ','}
      </React.Fragment>
    ));
  };

  const getPrivacyBadge = (rating: 'high' | 'medium' | 'low') => {
    const styles = {
      high: 'bg-green-500 text-white',
      medium: 'bg-yellow-500 text-black',
      low: 'bg-red-500 text-white'
    };
    const labels = {
      high: 'HIGH PRIVACY',
      medium: 'MEDIUM PRIVACY',
      low: 'LOW PRIVACY'
    };
    return (
      <Badge className={`${styles[rating]} font-bold text-xs`}>
        {labels[rating]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-slate-900 text-3xl font-bold mb-4">
          AI Privacy: A Head-to-Head Comparison
        </h2>
        <p className="text-slate-600 text-lg max-w-3xl mx-auto">
          Here's a breakdown of the privacy policies for three popular AI tools. We've pulled
          the <strong>actual language</strong> from their terms so you can see for yourself
          what they say about your data.
        </p>
      </div>

      {/* Desktop: 3-column grid */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        {policyComparisons.map((policy) => (
          <Card
            key={policy.tool}
            className="bg-white border-slate-300 shadow-md hover:border-blue-500 transition-colors"
          >
            <CardContent className="p-6 space-y-4">
              {/* Header */}
              <div className="text-center">
                <div className="text-4xl mb-3">{policy.icon}</div>
                <h3 className="text-slate-900 font-bold text-lg mb-2">{policy.tool}</h3>
                {getPrivacyBadge(policy.privacyRating)}
              </div>

              {/* What You Agreed To */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 min-h-[200px]">
                <h4 className="text-blue-700 font-bold text-sm mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  What You Agreed To
                </h4>
                <ul className="space-y-2 text-sm">
                  {policy.whatYouAgreedTo.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {item.startsWith('\u2705') ? (
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-slate-700">{item.replace(/^[\u2705\u274C]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* The Fine Print */}
              <div className="bg-slate-100 p-4 rounded-lg border border-slate-300 min-h-[250px]">
                <h4 className="text-amber-800 font-bold text-sm mb-3">
                  The Fine Print (Real Language from their Policies)
                </h4>
                <div className="space-y-3 text-xs">
                  {policy.finePrint.map((item, idx) => (
                    <div key={idx} className="bg-amber-100/60 p-3 rounded-lg border-l-4 border-amber-500">
                      <p className="text-slate-600 italic">
                        {item.text}
                        {showCitations && renderMultipleCitations(item.citationIds)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* The Bottom Line */}
              <div className={`p-4 rounded-lg ${
                policy.privacyRating === 'high'
                  ? 'bg-green-100/70 border-2 border-green-400'
                  : policy.privacyRating === 'medium'
                  ? 'bg-amber-100/60 border-2 border-amber-400'
                  : 'bg-red-100/60 border-2 border-red-400'
              }`}>
                <h4 className="text-slate-900 font-bold text-sm mb-2">The Bottom Line</h4>
                <p className="text-slate-700 text-xs leading-relaxed">
                  {policy.bottomLine}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile/Tablet: Stacked cards */}
      <div className="lg:hidden space-y-6">
        {policyComparisons.map((policy) => (
          <Card
            key={policy.tool}
            className="bg-white border-slate-300 shadow-md"
          >
            <CardContent className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{policy.icon}</div>
                  <div>
                    <h3 className="text-slate-900 font-bold text-lg">{policy.tool}</h3>
                    {getPrivacyBadge(policy.privacyRating)}
                  </div>
                </div>
              </div>

              {/* What You Agreed To */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="text-blue-700 font-bold text-sm mb-3">What You Agreed To</h4>
                <ul className="space-y-2 text-sm">
                  {policy.whatYouAgreedTo.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {item.startsWith('\u2705') ? (
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-slate-700">{item.replace(/^[\u2705\u274C]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* The Fine Print */}
              <div className="bg-slate-100 p-4 rounded-lg border border-slate-300">
                <h4 className="text-amber-800 font-bold text-sm mb-3">
                  The Fine Print
                </h4>
                <div className="space-y-3 text-xs">
                  {policy.finePrint.map((item, idx) => (
                    <div key={idx} className="bg-amber-100/60 p-3 rounded-lg border-l-4 border-amber-500">
                      <p className="text-slate-600 italic">
                        {item.text}
                        {showCitations && renderMultipleCitations(item.citationIds)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* The Bottom Line */}
              <div className={`p-4 rounded-lg ${
                policy.privacyRating === 'high'
                  ? 'bg-green-100/70 border-2 border-green-400'
                  : policy.privacyRating === 'medium'
                  ? 'bg-amber-100/60 border-2 border-amber-400'
                  : 'bg-red-100/60 border-2 border-red-400'
              }`}>
                <h4 className="text-slate-900 font-bold text-sm mb-2">The Bottom Line</h4>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {policy.bottomLine}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Insight Box */}
      <div className="bg-blue-100/70 p-6 rounded-lg border-2 border-blue-400 mt-8">
        <div className="flex items-start gap-4">
          <Info className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-slate-900 text-xl font-bold mb-2">
              The Key Difference: Business Model
            </h3>
            <p className="text-slate-700 text-lg">
              <strong>School tools</strong> are paid for by your school, so <em>you're the customer</em>.
              <strong> Consumer tools</strong> are "free," which means <em>you're the product</em> —
              your data is how they make money.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
