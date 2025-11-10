import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  validateModule,
  quickValidate,
  getValidationIcon,
  getValidationColors,
  type ValidationReport,
  type ValidationResult,
  type ModuleDefinition,
} from '@/services/builderValidator';

/**
 * ValidationPanel - Display validation results and quality score
 *
 * Phase 4.1: Validation Tools
 *
 * Features:
 * - Real-time validation of module quality
 * - Categorized results (accessibility, structure, content, completeness)
 * - Quality score (0-100)
 * - Expandable/collapsible sections
 * - Actionable fix suggestions
 *
 * Usage:
 * <ValidationPanel moduleDefinition={moduleDefinition} mode="quick" />
 */

interface ValidationPanelProps {
  moduleDefinition?: ModuleDefinition;
  mode?: 'quick' | 'full'; // quick = structure + completeness, full = all checks
  onValidate?: (report: ValidationReport) => void;
}

export default function ValidationPanel({
  moduleDefinition,
  mode = 'quick',
  onValidate,
}: ValidationPanelProps) {
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Auto-validate when module changes
  useEffect(() => {
    if (moduleDefinition) {
      runValidation();
    }
  }, [moduleDefinition, mode]);

  const runValidation = () => {
    if (!moduleDefinition) return;

    setIsValidating(true);

    try {
      const validationReport = mode === 'quick' ? quickValidate(moduleDefinition) : validateModule(moduleDefinition);
      setReport(validationReport);
      onValidate?.(validationReport);

      // Auto-expand categories with errors or warnings
      const newExpanded = new Set<string>();
      validationReport.results.forEach((result) => {
        if (result.severity === 'error' || result.severity === 'warning') {
          newExpanded.add(result.category);
        }
      });
      setExpandedCategories(newExpanded);
    } catch (err) {
      console.error('Validation error:', err);
    } finally {
      setIsValidating(false);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  if (!moduleDefinition) {
    return (
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Shield className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Module to Validate</h3>
          <p className="text-sm text-gray-600 max-w-md">
            Assemble a module to see validation results and quality score.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!report) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-pulse">
            <Shield className="w-16 h-16 text-gray-400 mb-4 mx-auto" />
            <p className="text-sm text-gray-600">Validating module...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group results by category
  const groupedResults: Record<string, ValidationResult[]> = {
    completeness: [],
    structure: [],
    content: [],
    accessibility: [],
  };

  report.results.forEach((result) => {
    groupedResults[result.category].push(result);
  });

  // Quality score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <Card className={report.passed ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className={report.passed ? 'w-5 h-5 text-green-600' : 'w-5 h-5 text-yellow-600'} />
              Module Validation {mode === 'quick' ? '(Quick Check)' : '(Full Analysis)'}
            </CardTitle>
            <CardDescription className="text-xs">
              {report.passed
                ? '✅ All critical checks passed'
                : `⚠️ ${report.summary.errors} error(s), ${report.summary.warnings} warning(s)`}
            </CardDescription>
          </div>

          {/* Quality Score */}
          <div className={`${getScoreBg(report.score)} px-4 py-2 rounded-lg text-center`}>
            <div className={`text-2xl font-bold ${getScoreColor(report.score)}`}>{report.score}</div>
            <div className="text-xs text-gray-600">Quality Score</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-white p-3 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600">{report.summary.errors}</div>
            <div className="text-xs text-gray-600">Errors</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{report.summary.warnings}</div>
            <div className="text-xs text-gray-600">Warnings</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{report.summary.info}</div>
            <div className="text-xs text-gray-600">Info</div>
          </div>
        </div>

        {/* Category Results */}
        {Object.entries(groupedResults).map(([category, results]) => {
          if (results.length === 0) return null;

          const isExpanded = expandedCategories.has(category);
          const categoryErrors = results.filter((r) => r.severity === 'error').length;
          const categoryWarnings = results.filter((r) => r.severity === 'warning').length;

          return (
            <div key={category} className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 capitalize">{category}</span>
                  <span className="text-xs text-gray-500">
                    ({results.length} {results.length === 1 ? 'issue' : 'issues'})
                  </span>
                  {categoryErrors > 0 && (
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded">
                      {categoryErrors} error{categoryErrors !== 1 ? 's' : ''}
                    </span>
                  )}
                  {categoryWarnings > 0 && (
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded">
                      {categoryWarnings} warning{categoryWarnings !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  {results.map((result, index) => {
                    const colors = getValidationColors(result.severity);
                    return (
                      <div key={index} className={`${colors.bg} ${colors.border} border-l-4 p-3 rounded`}>
                        <div className="flex items-start gap-2">
                          <span className="text-lg">{getValidationIcon(result.severity)}</span>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${colors.text}`}>{result.message}</p>
                            {result.location && (
                              <p className="text-xs text-gray-600 mt-1">📍 {result.location}</p>
                            )}
                            {result.fix && (
                              <p className="text-xs text-gray-700 mt-1 bg-white p-2 rounded border border-gray-200">
                                💡 <strong>Fix:</strong> {result.fix}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* All Clear Message */}
        {report.results.length === 0 && (
          <div className="bg-green-100 border border-green-200 rounded-lg p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-green-900">Perfect! No issues found</p>
            <p className="text-xs text-green-700 mt-1">Your module meets all quality standards</p>
          </div>
        )}

        {/* Validation Mode Toggle */}
        {mode === 'quick' && (
          <div className="text-center pt-2">
            <p className="text-xs text-gray-600 mb-2">
              Quick validation checks structure and completeness only
            </p>
            <Button
              onClick={() => {
                // This would trigger a mode change in parent component
                // For now, just a note
              }}
              variant="outline"
              className="text-xs border-gray-300 text-gray-700 hover:bg-gray-100"
              size="sm"
            >
              <Info className="w-3 h-3 mr-1" />
              Run Full Validation for Content & Accessibility Checks
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
