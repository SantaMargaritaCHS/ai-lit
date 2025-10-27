import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { getToolsByCategory, AITool } from '@/data/aiToolsPrivacyData';
import { getCitation } from '@/data/privacyPolicyCitations';

interface ToolsComparisonProps {
  showCitations?: boolean;
}

export const ToolsComparison: React.FC<ToolsComparisonProps> = ({
  showCitations = true
}) => {
  const schoolSafeTools = getToolsByCategory('school-safe');
  const consumerTools = getToolsByCategory('consumer');

  const renderCitations = (citationIds: number[]) => {
    if (!showCitations || citationIds.length === 0) return null;
    return (
      <span className="text-blue-400 text-xs ml-1">
        {citationIds.map((id, index) => (
          <React.Fragment key={id}>
            <sup className="cursor-help hover:text-blue-300">{id}</sup>
            {index < citationIds.length - 1 && ','}
          </React.Fragment>
        ))}
      </span>
    );
  };

  const getPrivacyBadge = (rating: 'high' | 'medium' | 'low') => {
    const styles = {
      high: 'bg-green-500 text-white',
      medium: 'bg-yellow-500 text-black',
      low: 'bg-red-500 text-white'
    };
    const labels = {
      high: 'HIGH PRIVACY',
      medium: 'MEDIUM',
      low: 'HIGH RISK'
    };
    return (
      <Badge className={`${styles[rating]} text-xs font-bold`}>
        {labels[rating]}
      </Badge>
    );
  };

  const renderTool = (tool: AITool) => (
    <Card key={tool.name} className="bg-slate-700 border-slate-600 hover:border-blue-400 transition-colors">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{tool.icon}</span>
            <div>
              <h4 className="text-white font-bold text-base">{tool.name}</h4>
              {getPrivacyBadge(tool.privacyRating)}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm">
          {tool.description}
          {renderCitations(tool.citationIds)}
        </p>

        {/* What It Means */}
        <div className="bg-slate-800/70 p-3 rounded-lg">
          <p className="text-blue-200 text-xs font-semibold mb-1">What This Means:</p>
          <p className="text-gray-300 text-xs">{tool.whatItMeans}</p>
        </div>

        {/* Privacy Features (School-Safe) */}
        {tool.privacyFeatures && tool.privacyFeatures.length > 0 && (
          <div>
            <p className="text-green-300 text-xs font-semibold mb-2 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Privacy Protections:
            </p>
            <ul className="space-y-1">
              {tool.privacyFeatures.map((feature, idx) => (
                <li key={idx} className="text-green-200 text-xs flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Privacy Risks (Consumer) */}
        {tool.privacyRisks && tool.privacyRisks.length > 0 && (
          <div>
            <p className="text-red-300 text-xs font-semibold mb-2 flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              Privacy Risks:
            </p>
            <ul className="space-y-1">
              {tool.privacyRisks.slice(0, 4).map((risk, idx) => (
                <li key={idx} className="text-red-200 text-xs flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendation */}
        <div className={`p-3 rounded-lg text-xs ${
          tool.category === 'school-safe'
            ? 'bg-green-900/30 border border-green-500/30'
            : 'bg-red-900/30 border border-red-500/30'
        }`}>
          <p className={`font-semibold mb-1 ${
            tool.category === 'school-safe' ? 'text-green-300' : 'text-yellow-300'
          }`}>
            {tool.category === 'school-safe' ? '✓ Recommendation:' : '⚠️ Use With Caution:'}
          </p>
          <p className="text-gray-200">{tool.recommendations}</p>
        </div>

        {/* Data Summary Badges */}
        <div className="flex flex-wrap gap-2 text-xs">
          {tool.dataTraining && (
            <Badge className="bg-red-600 text-white">Trains on Data</Badge>
          )}
          {tool.personalizedAds && (
            <Badge className="bg-orange-600 text-white">Ad Targeting</Badge>
          )}
          {tool.ageRestriction && (
            <Badge className="bg-blue-600 text-white">{tool.ageRestriction}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-white text-3xl font-bold mb-4">
          AI Tools: The Good, the Bad, and the Risky
        </h2>
        <p className="text-blue-100 text-lg max-w-3xl mx-auto">
          Not all AI tools are created equal. The key difference is the <strong>business model</strong>.
          Is the tool a service you're using, or are <em>you</em> the product that's being sold?
        </p>
      </div>

      {/* Two-Column Layout: Desktop */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN: School-Safe Tools */}
        <div>
          <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4 mb-6">
            <h3 className="text-green-300 text-2xl font-bold mb-2 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              School-Safe Tools: Your Best Bet for Privacy
            </h3>
            <p className="text-green-100 text-sm">
              Your school provides access to specific AI tools for a reason: they come with
              built-in privacy protections and legal agreements.
            </p>
          </div>

          <div className="space-y-4">
            {schoolSafeTools.map(renderTool)}
          </div>

          <div className="bg-green-500/20 p-4 rounded-lg border border-green-400 mt-6">
            <p className="text-green-200 text-sm">
              <strong>Why are they safer?</strong> Your school district has a legal agreement
              with these companies that puts strict limits on how your data can be used.
              <em> You are the user, not the product.</em>
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Consumer Tools */}
        <div>
          <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4 mb-6">
            <h3 className="text-red-300 text-2xl font-bold mb-2 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Consumer Tools: Use with Extreme Caution
            </h3>
            <p className="text-red-100 text-sm">
              These are consumer-grade tools where your data is often the price of admission.
              "Free" usually means you're the product.
            </p>
          </div>

          <div className="space-y-4">
            {consumerTools.map(renderTool)}
          </div>

          <div className="bg-red-500/20 p-4 rounded-lg border border-red-400 mt-6">
            <p className="text-red-200 text-sm">
              <strong>Why are they riskier?</strong> Their business model relies on collecting
              and analyzing user data. <em>You are the product</em>, and your data is used to
              make the company money through ads or by improving their technology.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet: Stacked Layout */}
      <div className="lg:hidden space-y-8">
        {/* School-Safe Section */}
        <div>
          <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4 mb-6">
            <h3 className="text-green-300 text-xl font-bold mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              School-Safe Tools
            </h3>
            <p className="text-green-100 text-sm">
              Your school provides these tools with built-in privacy protections.
            </p>
          </div>
          <div className="space-y-4">
            {schoolSafeTools.map(renderTool)}
          </div>
        </div>

        {/* Consumer Tools Section */}
        <div>
          <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4 mb-6">
            <h3 className="text-red-300 text-xl font-bold mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Consumer Tools - Use with Caution
            </h3>
            <p className="text-red-100 text-sm">
              "Free" tools where your data is the product.
            </p>
          </div>
          <div className="space-y-4">
            {consumerTools.map(renderTool)}
          </div>
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="bg-blue-500/20 p-6 rounded-lg border-2 border-blue-400 mt-8">
        <h3 className="text-white text-xl font-bold mb-3 text-center">
          The Bottom Line: Choose Your Tools Wisely
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-green-900/30 p-4 rounded-lg">
            <p className="text-green-300 font-bold mb-2">✓ For Schoolwork & Personal Topics:</p>
            <p className="text-green-100">
              Always use school-provided tools like Microsoft Copilot (Education), SchoolAI,
              or Snorkl. They're designed to protect your privacy.
            </p>
          </div>
          <div className="bg-red-900/30 p-4 rounded-lg">
            <p className="text-red-300 font-bold mb-2">⚠️ For Consumer AI Tools:</p>
            <p className="text-red-100">
              Assume everything you type is public. Never share real names, schools, personal
              struggles, or identifying information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
