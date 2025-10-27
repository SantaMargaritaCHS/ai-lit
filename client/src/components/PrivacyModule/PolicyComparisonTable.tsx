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
        <sup className="text-blue-400 cursor-help hover:text-blue-300 ml-0.5">
          {citationId}
        </sup>
        {hoveredCitation === citationId && (
          <div className="absolute bottom-full left-0 mb-2 w-72 bg-slate-900 border border-blue-400 rounded-lg p-3 shadow-xl z-50 text-xs">
            <p className="text-white font-semibold mb-1">{citation.title}</p>
            <p className="text-gray-300">{citation.organization}</p>
            <p className="text-blue-300 text-xs mt-1">{citation.accessed}</p>
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
        <h2 className="text-white text-3xl font-bold mb-4">
          AI Privacy: A Head-to-Head Comparison
        </h2>
        <p className="text-blue-100 text-lg max-w-3xl mx-auto">
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
            className="bg-slate-800 border-slate-600 hover:border-blue-400 transition-colors"
          >
            <CardContent className="p-6 space-y-4">
              {/* Header */}
              <div className="text-center">
                <div className="text-4xl mb-3">{policy.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{policy.tool}</h3>
                {getPrivacyBadge(policy.privacyRating)}
              </div>

              {/* What You Agreed To */}
              <div className="bg-slate-700/50 p-4 rounded-lg min-h-[200px]">
                <h4 className="text-blue-300 font-bold text-sm mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  What You Agreed To
                </h4>
                <ul className="space-y-2 text-sm">
                  {policy.whatYouAgreedTo.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {item.startsWith('✅') ? (
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-white">{item.replace(/^[✅❌]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* The Fine Print */}
              <div className="bg-slate-900/50 p-4 rounded-lg min-h-[250px]">
                <h4 className="text-yellow-300 font-bold text-sm mb-3">
                  The Fine Print (Real Language from their Policies)
                </h4>
                <div className="space-y-3 text-xs">
                  {policy.finePrint.map((item, idx) => (
                    <div key={idx} className="bg-black/30 p-3 rounded border-l-2 border-yellow-400">
                      <p className="text-gray-300 italic">
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
                  ? 'bg-green-900/30 border border-green-500/30'
                  : policy.privacyRating === 'medium'
                  ? 'bg-yellow-900/30 border border-yellow-500/30'
                  : 'bg-red-900/30 border border-red-500/30'
              }`}>
                <h4 className="text-white font-bold text-sm mb-2">The Bottom Line</h4>
                <p className="text-gray-200 text-xs leading-relaxed">
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
            className="bg-slate-800 border-slate-600"
          >
            <CardContent className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{policy.icon}</div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{policy.tool}</h3>
                    {getPrivacyBadge(policy.privacyRating)}
                  </div>
                </div>
              </div>

              {/* What You Agreed To */}
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="text-blue-300 font-bold text-sm mb-3">What You Agreed To</h4>
                <ul className="space-y-2 text-sm">
                  {policy.whatYouAgreedTo.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {item.startsWith('✅') ? (
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-white">{item.replace(/^[✅❌]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* The Fine Print */}
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <h4 className="text-yellow-300 font-bold text-sm mb-3">
                  The Fine Print
                </h4>
                <div className="space-y-3 text-xs">
                  {policy.finePrint.map((item, idx) => (
                    <div key={idx} className="bg-black/30 p-3 rounded border-l-2 border-yellow-400">
                      <p className="text-gray-300 italic">
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
                  ? 'bg-green-900/30 border border-green-500/30'
                  : policy.privacyRating === 'medium'
                  ? 'bg-yellow-900/30 border border-yellow-500/30'
                  : 'bg-red-900/30 border border-red-500/30'
              }`}>
                <h4 className="text-white font-bold text-sm mb-2">The Bottom Line</h4>
                <p className="text-gray-200 text-sm leading-relaxed">
                  {policy.bottomLine}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Insight Box */}
      <div className="bg-blue-500/20 p-6 rounded-lg border-2 border-blue-400/50 mt-8">
        <div className="flex items-start gap-4">
          <Info className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-white text-xl font-bold mb-2">
              The Key Difference: Business Model
            </h3>
            <p className="text-blue-100 text-lg">
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
