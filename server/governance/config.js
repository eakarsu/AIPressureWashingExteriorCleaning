module.exports={
 caseType:'reconciled_exterior_service_job',initialState:'intake_validated',
 states:['intake_validated','site_assessed','estimate_approved','scheduled','crew_assigned','in_progress','exception_hold','completed','invoice_pending','payment_reconciled','closed','cancelled'],
 createRoles:['estimator','service_manager'],assessmentRoles:['estimator','safety_reviewer','environmental_reviewer','dispatcher'],auditRoles:['service_manager','finance_reviewer','privacy_officer','auditor'],connectorRoles:['integration_operator','service_manager'],
 evidenceKinds:['intake_snapshot','property_consent','site_assessment','surface_photo_manifest','weather_map_snapshot','scope_version','chemical_safety_plan','environmental_compliance','estimate_tax_version','customer_approval','schedule_reservation','crew_assignment','work_log','exception_record','completion_acceptance','invoice_receipt','payment_receipt','refund_receipt','accounting_reconciliation'],
 requiredSignals:['scopeVersion','siteVersion','priceVersion','quotedTotal','calculatedTotal','propertyConsentStatus','weatherStatus','surfaceSafetyStatus','chemicalPlanStatus','environmentalStatus','taxStatus','scheduleStatus','policyVersion'],
 professionalBoundary:'Estimates, chemicals, equipment, scheduling, payment, and service execution require customer, safety, environmental, finance, and operations approval; the application cannot direct unsafe field work.',
 connectors:[{name:'weather_maps',purpose:'timestamped site condition snapshots'},{name:'payment',purpose:'authorization capture refund and webhook receipts'},{name:'tax',purpose:'versioned tax quote receipts'},{name:'accounting',purpose:'invoice payment and reconciliation receipts'},{name:'scheduling',purpose:'capacity and crew assignment receipts'},{name:'inventory',purpose:'chemical and equipment reservation receipts'},{name:'messaging',purpose:'customer and crew acknowledgements'}],
 transitions:[
  {from:'intake_validated',action:'record_site_assessment',to:'site_assessed',roles:['estimator','safety_reviewer'],requiresEvidence:true},
  {from:'site_assessed',action:'approve_estimate',to:'estimate_approved',roles:['service_manager','environmental_reviewer'],requiresEvidence:true,dualControl:true},
  {from:'estimate_approved',action:'schedule_job',to:'scheduled',roles:['dispatcher'],requiresEvidence:true},
  {from:'scheduled',action:'assign_crew',to:'crew_assigned',roles:['dispatcher','service_manager'],requiresEvidence:true,dualControl:true},
  {from:'crew_assigned',action:'start_work',to:'in_progress',roles:['crew_lead'],requiresEvidence:true},
  {from:'in_progress',action:'open_exception',to:'exception_hold',roles:['crew_lead','safety_reviewer','environmental_reviewer'],requiresEvidence:true},
  {from:'exception_hold',action:'cancel_job',to:'cancelled',roles:['service_manager','finance_reviewer'],requiresEvidence:true,dualControl:true},
  {from:'exception_hold',action:'resume_work',to:'in_progress',roles:['safety_reviewer','environmental_reviewer'],requiresEvidence:true,dualControl:true},
  {from:'in_progress',action:'record_completion',to:'completed',roles:['crew_lead','service_manager'],requiresEvidence:true},
  {from:'completed',action:'issue_invoice',to:'invoice_pending',roles:['finance_reviewer'],requiresEvidence:true,dualControl:true},
  {from:'invoice_pending',action:'reconcile_payment',to:'payment_reconciled',roles:['finance_reviewer','integration_operator'],requiresEvidence:true,dualControl:true},
  {from:'payment_reconciled',action:'close_job',to:'closed',roles:['service_manager'],requiresEvidence:true,dualControl:true}
 ],
 acceptedFixture:{scopeVersion:'s1',siteVersion:'site1',priceVersion:'p1',quotedTotal:650,calculatedTotal:650,propertyConsentStatus:'verified',weatherStatus:'safe',surfaceSafetyStatus:'verified',chemicalPlanStatus:'approved',environmentalStatus:'verified',taxStatus:'verified',scheduleStatus:'available',policyVersion:'v1'},
 readyDisposition:'human_job_approval_required',holdDisposition:'safety_pricing_or_fulfillment_hold',decisionField:'serviceCommand',
 assess:x=>{const quoted=Number(x.quotedTotal),calculated=Number(x.calculatedTotal);const totals=Number.isFinite(quoted)&&Number.isFinite(calculated)&&quoted>=0&&calculated>=0&&Math.abs(quoted-calculated)<=0.01;const ready=totals&&x.propertyConsentStatus==='verified'&&x.weatherStatus==='safe'&&x.surfaceSafetyStatus==='verified'&&x.chemicalPlanStatus==='approved'&&x.environmentalStatus==='verified'&&x.taxStatus==='verified'&&x.scheduleStatus==='available';return{disposition:ready?'human_job_approval_required':'safety_pricing_or_fulfillment_hold',serviceCommand:null,chargeCommand:null,metrics:{quotedTotal:quoted,calculatedTotal:calculated},versions:{scope:x.scopeVersion,site:x.siteVersion,price:x.priceVersion}};}
};
