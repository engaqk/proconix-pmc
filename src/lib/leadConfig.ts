export interface LeadAsset {
  slug: string;
  title: string;
  description: string;
  pdfPath: string;
  immediateSubject: string;
  immediateBody: string;
  dripTemplates: {
    day1: { subject: string; body: string };
    day2: { subject: string; body: string };
    day3: { subject: string; body: string };
    day4: { subject: string; body: string };
  };
}

export const leadRegistry: Record<string, LeadAsset> = {
  "pre-construction-checklist": {
    slug: "pre-construction-checklist",
    title: "Pre-Construction Governance Checklist",
    description: "The definitive 13-point diagnostic checklist to protect your capital before breaking ground on $5M-$100M+ projects in Africa.",
    pdfPath: "/assets/lead-magnets/pre-construction-checklist.pdf",
    immediateSubject: "Your Pre-Construction Governance Checklist - Proconix PMC",
    immediateBody: `
      <h2>Your Pre-Construction Governance Checklist is Ready</h2>
      <p>Thank you for requesting this resource. Implementing structured pre-construction governance is the single most critical step you can take to safeguard your project from early cost variations.</p>
      <p>Click below to download your copy:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://proconixpmc.com/assets/lead-magnets/pre-construction-checklist.pdf" style="display: inline-block; padding: 15px 30px; background-color: #C9A84C; color: #0B1D35; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase;">Download PDF Checklist</a>
      </div>
      <p>Over the next 4 days, I will share critical case insights showing how pre-construction failures derail major infrastructure builds and how to avoid them.</p>
    `,
    dripTemplates: {
      day1: {
        subject: "Day 1: The 70% Rule in African Capital Projects",
        body: `
          <h3>The 70% Rule of Construction Governance</h3>
          <p>Over 70% of construction project failures in Africa are determined before a single contractor mobilises on site. When pre-construction governance is rushed or bypassed, design gaps, constructability mismatches, and contract ambiguities are locked in.</p>
          <p>Once you break ground, resolving these issues can cost up to 10x more than catching them during the engineering phase.</p>
          <p><strong>Action Step:</strong> Review Section 3 of your checklist regarding design freeze milestones. Ensure your board does not authorise mobilisation payments until a full constructability review is signed off.</p>
        `
      },
      day2: {
        subject: "Day 2: Constructability Mismatches vs. Theory",
        body: `
          <h3>Reality vs. Design Office Theory</h3>
          <p>Many international design firms design structures that look spectacular on paper but cannot be built efficiently using locally available skills, materials, or supply chains in East Africa.</p>
          <p>This leads to massive variation claims when the contractor hits the ground and discovers the design specifications cannot be executed locally without importing specialized equipment at high cost.</p>
          <p><strong>Action Step:</strong> Check Section 5 of the checklist. Ensure local engineers register constructability reviews calibrated specifically to local regulatory and procurement realities.</p>
        `
      },
      day3: {
        subject: "Day 3: Controlling Variations in Real-Time",
        body: `
          <h3>Eliminating Billing Leakage</h3>
          <p>A common error in project execution is allowing the contractor to execute variations before formal approval is signed off by the sponsor's technical representative. This creates retrospective claims where the sponsor has zero leverage.</p>
          <p>A structured project governance architecture establishes a strict Variation Control Protocol (VCP) where no variation under 1% of CAPEX is executed without written PM authorization, and nothing over 1% goes without Board-level sign-off.</p>
          <p><strong>Action Step:</strong> Review Section 8 (Variation Governance) in your checklist copy and check your current billing controls.</p>
        `
      },
      day4: {
        subject: "Day 4: Ready for the Next Step?",
        body: `
          <h3>Your Governance Command Structure</h3>
          <p>I hope the Pre-Construction Checklist and these insights have provided you with a clear perspective on safeguarding your capital.</p>
          <p>If you are managing a project in the $5M-$100M+ range and want to ensure a professional, conflict-free governance command is established, let's schedule a brief Discovery Call.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://proconixpmc.com/#contact" style="display: inline-block; padding: 15px 30px; background-color: #C9A84C; color: #0B1D35; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase;">Book a Discovery Call</a>
          </div>
          <p>Regards,<br><strong>Talibbhai Khanji</strong><br>Founder & Principal Consultant<br>Proconix PMC</p>
        `
      }
    }
  },
  "contractor-risk-audit": {
    slug: "contractor-risk-audit",
    title: "Contractor Risk Audit Guide",
    description: "How to audit contractor risk exposure and verify financial capability before awarding major EPCM packages in East Africa.",
    pdfPath: "/assets/lead-magnets/contractor-risk-audit.pdf",
    immediateSubject: "Your Contractor Risk Audit Guide - Proconix PMC",
    immediateBody: `
      <h2>Contractor Risk Audit Guide Download</h2>
      <p>Thank you for requesting this resource. Auditing contractor balance sheets and verification track records is essential to avoid mid-project default.</p>
      <p>Click below to download your copy:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://proconixpmc.com/assets/lead-magnets/contractor-risk-audit.pdf" style="display: inline-block; padding: 15px 30px; background-color: #C9A84C; color: #0B1D35; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase;">Download PDF Guide</a>
      </div>
    `,
    dripTemplates: {
      day1: {
        subject: "Day 1: The Danger of Low-Bid Wins",
        body: `<h3>Why Low Bids Cost More</h3><p>In African construction markets, contractor failure is frequently caused by 'the winner's curse'—where a contractor underbids to secure a project, then faces insolvencies mid-way through. This leads to legal disputes and complete site abandonment.</p>`
      },
      day2: {
        subject: "Day 2: Verifying Subcontractor Networks",
        body: `<h3>Mapping Subcontractor Exposure</h3><p>A contractor is only as strong as their local subcontractor base. Ensure your risk audit includes direct verification of key steel, MEP, and earthworks suppliers to confirm payment flows.</p>`
      },
      day3: {
        subject: "Day 3: Retainage & Performance Bonds",
        body: `<h3>Securing the Sponsor's Capital</h3><p>Ensure that performance bonds (typically 10%) are issued by top-tier commercial banks and are completely unconditional and callable on demand. Never accept weak insurance bonds.</p>`
      },
      day4: {
        subject: "Day 4: Restructure Your Procurement Governance",
        body: `<h3>Need a Procurement Audit?</h3><p>If you're in the final stages of contractor selection for a major capital asset, let's schedule a call to review your commercial contract clauses.</p><div style="text-align: center; margin: 20px 0;"><a href="https://proconixpmc.com/#contact" style="display: inline-block; padding: 12px 24px; background-color: #C9A84C; color: #0B1D35; text-decoration: none; font-weight: bold;">Schedule Call</a></div>`
      }
    }
  },
  "capex-allocation-strategy": {
    slug: "capex-allocation-strategy",
    title: "CAPEX Allocation Strategy Guide",
    description: "Optimizing budget contingencies and currency risk hedging on cross-border construction projects.",
    pdfPath: "/assets/lead-magnets/capex-allocation-strategy.pdf",
    immediateSubject: "Your CAPEX Allocation Strategy Guide - Proconix PMC",
    immediateBody: `
      <h2>CAPEX Allocation Strategy Guide</h2>
      <p>Thank you for requesting this resource. Managing foreign exchange fluctuation is vital to maintain target ROI on African developments.</p>
      <p>Click below to download your copy:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://proconixpmc.com/assets/lead-magnets/capex-allocation-strategy.pdf" style="display: inline-block; padding: 15px 30px; background-color: #C9A84C; color: #0B1D35; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase;">Download PDF Guide</a>
      </div>
    `,
    dripTemplates: {
      day1: { subject: "Day 1: Currency Devaluation Playbook", body: `<h3>Devaluation Management</h3><p>Ensure that international procurement contracts are denominated in stable currencies (USD/EUR) while local civil works are paid in local currencies with defined fluctuation ceilings.</p>` },
      day2: { subject: "Day 2: Managing Contingency Drawdowns", body: `<h3>Strict Contingency Governance</h3><p>Contingencies must be managed by the owner's representative, not the contractor. Never bake contingency into contractor bills.</p>` },
      day3: { subject: "Day 3: Escalation Risk Control", body: `<h3>Material Price Escalations</h3><p>Incorporate strict material price indices clauses in contracts rather than accepting open-ended escalation claims.</p>` },
      day4: { subject: "Day 4: Align Your Capital Budget", body: `<h3>Request a Financial Audit</h3><p>Let us audit your project budget baseline to ensure proper risk contingencies are modeled.</p><div style="text-align: center; margin: 20px 0;"><a href="https://proconixpmc.com/#contact" style="display: inline-block; padding: 12px 24px; background-color: #C9A84C; color: #0B1D35; text-decoration: none; font-weight: bold;">Speak with Talibbhai</a></div>` }
    }
  },
  "epcm-execution-playbook": {
    slug: "epcm-execution-playbook",
    title: "EPCM Execution Playbook",
    description: "Owner's engineering guide to managing multiple Engineering, Procurement, and Construction packages.",
    pdfPath: "/assets/lead-magnets/epcm-execution-playbook.pdf",
    immediateSubject: "Your EPCM Execution Playbook - Proconix PMC",
    immediateBody: `
      <h2>EPCM Execution Playbook</h2>
      <p>Thank you for requesting this resource. Gain full clarity over your owner's engineer governance mandates.</p>
      <p>Click below to download your copy:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://proconixpmc.com/assets/lead-magnets/epcm-execution-playbook.pdf" style="display: inline-block; padding: 15px 30px; background-color: #C9A84C; color: #0B1D35; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase;">Download PDF Playbook</a>
      </div>
    `,
    dripTemplates: {
      day1: { subject: "Day 1: Structuring EPCM Relationships", body: `<h3>EPCM Setup</h3><p>Avoid conflicts of interest by separating design engineering and project management governance layers.</p>` },
      day2: { subject: "Day 2: Commissioning Planning", body: `<h3>Commissioning Starts on Day 1</h3><p>Model your handover criteria before design completion to prevent zero-defect delays.</p>` },
      day3: { subject: "Day 3: Interface Risk Management", body: `<h3>Managing Package Interfaces</h3><p>Ensure interface matrices are explicitly integrated into each packages contract scope.</p>` },
      day4: { subject: "Day 4: Ready for EPCM Supervision?", body: `<h3>Schedule a Project Setup Call</h3><p>We build out your custom EPCM governance framework. Set up a discovery call now.</p><div style="text-align: center; margin: 20px 0;"><a href="https://proconixpmc.com/#contact" style="display: inline-block; padding: 12px 24px; background-color: #C9A84C; color: #0B1D35; text-decoration: none; font-weight: bold;">Book Call</a></div>` }
    }
  },
  "procurement-intelligence": {
    slug: "procurement-intelligence",
    title: "Africa Construction Procurement Intelligence",
    description: "Navigating local content laws, duty exemptions, and port logistics for heavy machinery and FF&E.",
    pdfPath: "/assets/lead-magnets/procurement-intelligence.pdf",
    immediateSubject: "Your Procurement Intelligence Report - Proconix PMC",
    immediateBody: `
      <h2>Procurement Intelligence Report</h2>
      <p>Thank you for requesting this resource. Navigate customs exemptions and shipping interfaces successfully.</p>
      <p>Click below to download your copy:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://proconixpmc.com/assets/lead-magnets/procurement-intelligence.pdf" style="display: inline-block; padding: 15px 30px; background-color: #C9A84C; color: #0B1D35; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase;">Download PDF Report</a>
      </div>
    `,
    dripTemplates: {
      day1: { subject: "Day 1: Duty Exemption Pathways", body: `<h3>Exemptions Strategy</h3><p>Secure investment approvals upfront to capture VAT and import tariff exemptions on heavy capital equipment.</p>` },
      day2: { subject: "Day 2: Local Content Compliance", body: `<h3>Navigating Local Laws</h3><p>Calibrate your procurement specs to meet state content guidelines without sacrificing material quality.</p>` },
      day3: { subject: "Day 3: Port and Transit Logistics", body: `<h3>Mitigating Demurrage</h3><p>Manage transit interfaces closely to prevent costly demurrage penalties at Dar es Salaam and Mombasa ports.</p>` },
      day4: { subject: "Day 4: Need Logistical Governance?", body: `<h3>Connect with Proconix</h3><p>Ensure your shipping packages are structured correctly. Let's arrange a brief review call.</p><div style="text-align: center; margin: 20px 0;"><a href="https://proconixpmc.com/#contact" style="display: inline-block; padding: 12px 24px; background-color: #C9A84C; color: #0B1D35; text-decoration: none; font-weight: bold;">Talk to Us</a></div>` }
    }
  },
  "hospitality-resort-governance": {
    slug: "hospitality-resort-governance",
    title: "Zanzibar & East Africa Resort Governance",
    description: "Overcoming island logistics and operator handover criteria for premium luxury hospitality projects.",
    pdfPath: "/assets/lead-magnets/hospitality-resort-governance.pdf",
    immediateSubject: "Your Resort Governance Guide - Proconix PMC",
    immediateBody: `
      <h2>Resort Governance Guide</h2>
      <p>Thank you for requesting this resource. Island logistics require unique planning.</p>
      <p>Click below to download your copy:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://proconixpmc.com/assets/lead-magnets/hospitality-resort-governance.pdf" style="display: inline-block; padding: 15px 30px; background-color: #C9A84C; color: #0B1D35; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase;">Download PDF Guide</a>
      </div>
    `,
    dripTemplates: {
      day1: { subject: "Day 1: Island Material Logistics", body: `<h3>Zanzibar Logistics</h3><p>Factor shipping lead times and seasonal barge transport conditions into your engineering schedule early.</p>` },
      day2: { subject: "Day 2: Operator Handover Rules", body: `<h3>Meeting Brand Standards</h3><p>Brand operators have rigid quality standards. Run mock room handovers early to align details.</p>` },
      day3: { subject: "Day 3: Specialist Hospitality MEP", body: `<h3>Managing Specialized Subcontracts</h3><p>MEP accounts for a massive portion of resort budgets. Ensure specialist engineers oversee water and backup power installs.</p>` },
      day4: { subject: "Day 4: Ready to Build in Zanzibar?", body: `<h3>Discuss Resort Mandates</h3><p>Proconix governs high-end resort delivery on the East African coast. Let's arrange a call.</p><div style="text-align: center; margin: 20px 0;"><a href="https://proconixpmc.com/#contact" style="display: inline-block; padding: 12px 24px; background-color: #C9A84C; color: #0B1D35; text-decoration: none; font-weight: bold;">Arrange Call</a></div>` }
    }
  },
  "cost-control-protocol": {
    slug: "cost-control-protocol",
    title: "Variations & Cost Control Protocol",
    description: "The strict financial authorization checklist to eliminate billing leakage and scope creep.",
    pdfPath: "/assets/lead-magnets/cost-control-protocol.pdf",
    immediateSubject: "Your Cost Control Protocol - Proconix PMC",
    immediateBody: `
      <h2>Cost Control Protocol Guide</h2>
      <p>Thank you for requesting this resource. Prevent budget overruns through structural billing checks.</p>
      <p>Click below to download your copy:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://proconixpmc.com/assets/lead-magnets/cost-control-protocol.pdf" style="display: inline-block; padding: 15px 30px; background-color: #C9A84C; color: #0B1D35; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase;">Download PDF Guide</a>
      </div>
    `,
    dripTemplates: {
      day1: { subject: "Day 1: The Variation Approval Matrix", body: `<h3>Approval Control</h3><p>Define clear CAPEX thresholds for engineers, project managers, and board directors for variations.</p>` },
      day2: { subject: "Day 2: Audit Stage Billings", body: `<h3>Billing Verifications</h3><p>Never approve progress payments based on contractor estimates. Use verified material measures only.</p>` },
      day3: { subject: "Day 3: Scope Creep Controls", body: `<h3>Rejecting Informal Changes</h3><p>Enforce strict change order requests before work is carried out to block unbudgeted claims.</p>` },
      day4: { subject: "Day 4: Optimize Project Controls", body: `<h3>Get a Cost Governance Audit</h3><p>Let Proconix review your variation matrix to block financial leaks.</p><div style="text-align: center; margin: 20px 0;"><a href="https://proconixpmc.com/#contact" style="display: inline-block; padding: 12px 24px; background-color: #C9A84C; color: #0B1D35; text-decoration: none; font-weight: bold;">Request Audit</a></div>` }
    }
  },
  "capital-project-reporting": {
    slug: "capital-project-reporting",
    title: "Board-Level Capital Project Reporting",
    description: "Executive dashboards and KPI structures for cross-border sponsors and institutional funds.",
    pdfPath: "/assets/lead-magnets/capital-project-reporting.pdf",
    immediateSubject: "Your Capital Project Reporting Guide - Proconix PMC",
    immediateBody: `
      <h2>Capital Project Reporting Guide</h2>
      <p>Thank you for requesting this resource. Establish transparent dashboard analytics for your stakeholders.</p>
      <p>Click below to download your copy:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://proconixpmc.com/assets/lead-magnets/capital-project-reporting.pdf" style="display: inline-block; padding: 15px 30px; background-color: #C9A84C; color: #0B1D35; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase;">Download PDF Guide</a>
      </div>
    `,
    dripTemplates: {
      day1: { subject: "Day 1: Defining Earned Value Metrics", body: `<h3>Earned Value Analysis</h3><p>Track Schedule Variance (SV) and Cost Variance (CV) in real-time to avoid late surprises.</p>` },
      day2: { subject: "Day 2: Risk Heat Map Structures", body: `<h3>Visualizing Exposure</h3><p>Maintain a dynamic risk register at the executive level showing active mitigation plans.</p>` },
      day3: { subject: "Day 3: Streamlining Sponsor Visibility", body: `<h3>Remote Governance Rooms</h3><p>Deploy virtual data rooms to ensure cross-border board members can audit documents.</p>` },
      day4: { subject: "Day 4: Ready for Board-Level Controls?", body: `<h3>Partner with Proconix</h3><p>We structure transparent reporting for capital project sponsors. Book a discovery call.</p><div style="text-align: center; margin: 20px 0;"><a href="https://proconixpmc.com/#contact" style="display: inline-block; padding: 12px 24px; background-color: #C9A84C; color: #0B1D35; text-decoration: none; font-weight: bold;">Book Call</a></div>` }
    }
  },
  "constructability-standards": {
    slug: "constructability-standards",
    title: "Constructability Review Standards",
    description: "Engineering parameters to align architectural drawings with locally sourced construction methods in Africa.",
    pdfPath: "/assets/lead-magnets/constructability-standards.pdf",
    immediateSubject: "Your Constructability Review Standards - Proconix PMC",
    immediateBody: `
      <h2>Constructability Review Standards</h2>
      <p>Thank you for requesting this resource. Aligning designs with execution methods is key.</p>
      <p>Click below to download your copy:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://proconixpmc.com/assets/lead-magnets/constructability-standards.pdf" style="display: inline-block; padding: 15px 30px; background-color: #C9A84C; color: #0B1D35; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase;">Download PDF Guide</a>
      </div>
    `,
    dripTemplates: {
      day1: { subject: "Day 1: Design Phase Reviews", body: `<h3>Design Optimization</h3><p>Verify structural specs with local raw material sizes to prevent custom milling delays.</p>` },
      day2: { subject: "Day 2: Material Substitution Management", body: `<h3>Quality Safeguards</h3><p>Ensure subcontractor material substitutions are approved by independent engineers, not the builder.</p>` },
      day3: { subject: "Day 3: Prefabrication Opportunities", body: `<h3>Speeding Up Site Execution</h3><p>Identify off-site casting and prefabrication opportunities to bypass local site constraints.</p>` },
      day4: { subject: "Day 4: Optimize Design Performance", body: `<h3>Arrange a Review Call</h3><p>Need a constructability audit? Let's connect to review your design packages.</p><div style="text-align: center; margin: 20px 0;"><a href="https://proconixpmc.com/#contact" style="display: inline-block; padding: 12px 24px; background-color: #C9A84C; color: #0B1D35; text-decoration: none; font-weight: bold;">Call Talibbhai</a></div>` }
    }
  },
  "delay-avoidance": {
    slug: "delay-avoidance",
    title: "Construction Delay & Dispute Avoidance",
    description: "Contractual safeguards, extension of time (EOT) auditing, and liquidated damages implementation.",
    pdfPath: "/assets/lead-magnets/delay-avoidance.pdf",
    immediateSubject: "Your Delay & Dispute Avoidance Guide - Proconix PMC",
    immediateBody: `
      <h2>Delay & Dispute Avoidance Guide</h2>
      <p>Thank you for requesting this resource. Protect your schedule from builder delays.</p>
      <p>Click below to download your copy:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://proconixpmc.com/assets/lead-magnets/delay-avoidance.pdf" style="display: inline-block; padding: 15px 30px; background-color: #C9A84C; color: #0B1D35; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase;">Download PDF Guide</a>
      </div>
    `,
    dripTemplates: {
      day1: { subject: "Day 1: Standardizing Critical Path Tracking", body: `<h3>CPM Schedule Tracking</h3><p>Insist the contractor maintains an active CPM schedule in Primavera/Project. Never accept static charts.</p>` },
      day2: { subject: "Day 2: Validating EOT Claims", body: `<h3>EOT Claims Governance</h3><p>Verify that claims for rain or delay affect the critical path directly before granting extensions.</p>` },
      day3: { subject: "Day 3: Enforcing Liquidated Damages", body: `<h3>Delay Remedies</h3><p>Establish enforceable liquidated damages clauses that trigger automatically upon milestone failure.</p>` },
      day4: { subject: "Day 4: Ensure Project Acceleration", body: `<h3>Set Up schedule Governance</h3><p>We assist owners in auditing schedule progress. Request a delay mitigation call.</p><div style="text-align: center; margin: 20px 0;"><a href="https://proconixpmc.com/#contact" style="display: inline-block; padding: 12px 24px; background-color: #C9A84C; color: #0B1D35; text-decoration: none; font-weight: bold;">Schedule Call</a></div>` }
    }
  }
};
