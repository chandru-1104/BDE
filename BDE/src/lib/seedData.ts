import { supabase } from './supabase';

export async function seedSampleData() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    console.error('User not authenticated');
    return;
  }

  const sampleLeads = [
    {
      company_name: 'TechCorp Solutions',
      contact_person: 'John Smith',
      email: 'john.smith@techcorp.com',
      phone: '+1 555-0101',
      industry: 'Technology',
      lead_source: 'linkedin',
      status: 'qualified',
      estimated_value: 75000,
      probability: 70,
      expected_close_date: '2025-03-15',
      notes: 'Interested in enterprise solution. Follow up next week.',
      created_by: user.id,
    },
    {
      company_name: 'Global Retail Inc',
      contact_person: 'Sarah Johnson',
      email: 'sarah.j@globalretail.com',
      phone: '+1 555-0102',
      industry: 'Retail',
      lead_source: 'website',
      status: 'negotiating',
      estimated_value: 120000,
      probability: 85,
      expected_close_date: '2025-02-28',
      notes: 'Final pricing discussion scheduled for next week.',
      created_by: user.id,
    },
    {
      company_name: 'FinanceFirst Bank',
      contact_person: 'Michael Chen',
      email: 'mchen@financefirst.com',
      phone: '+1 555-0103',
      industry: 'Finance',
      lead_source: 'referral',
      status: 'contacted',
      estimated_value: 200000,
      probability: 50,
      expected_close_date: '2025-04-20',
      notes: 'Warm lead from existing client. Needs detailed proposal.',
      created_by: user.id,
    },
    {
      company_name: 'HealthPlus Medical',
      contact_person: 'Emily Rodriguez',
      email: 'emily.r@healthplus.com',
      phone: '+1 555-0104',
      industry: 'Healthcare',
      lead_source: 'event',
      status: 'new',
      estimated_value: 50000,
      probability: 30,
      expected_close_date: '2025-05-10',
      notes: 'Met at healthcare expo. Initial interest shown.',
      created_by: user.id,
    },
    {
      company_name: 'EduLearn Academy',
      contact_person: 'David Park',
      email: 'dpark@edulearn.edu',
      phone: '+1 555-0105',
      industry: 'Education',
      lead_source: 'cold_call',
      status: 'qualified',
      estimated_value: 40000,
      probability: 60,
      expected_close_date: '2025-03-30',
      notes: 'Looking for training platform. Budget approved.',
      created_by: user.id,
    },
    {
      company_name: 'AutoDrive Motors',
      contact_person: 'Lisa Anderson',
      email: 'l.anderson@autodrive.com',
      phone: '+1 555-0106',
      industry: 'Automotive',
      lead_source: 'direct',
      status: 'won',
      estimated_value: 95000,
      probability: 100,
      expected_close_date: '2025-01-15',
      notes: 'Contract signed. Implementation starts next month.',
      created_by: user.id,
    },
    {
      company_name: 'CloudSky Services',
      contact_person: 'Robert Taylor',
      email: 'rtaylor@cloudsky.com',
      phone: '+1 555-0107',
      industry: 'Technology',
      lead_source: 'website',
      status: 'lost',
      estimated_value: 60000,
      probability: 0,
      expected_close_date: '2025-01-20',
      notes: 'Went with competitor. Price was main concern.',
      created_by: user.id,
    },
    {
      company_name: 'GreenEnergy Solutions',
      contact_person: 'Maria Garcia',
      email: 'mgarcia@greenenergy.com',
      phone: '+1 555-0108',
      industry: 'Energy',
      lead_source: 'referral',
      status: 'qualified',
      estimated_value: 150000,
      probability: 65,
      expected_close_date: '2025-04-15',
      notes: 'Strong interest in sustainability platform.',
      created_by: user.id,
    },
  ];

  const sampleActivities = [
    {
      activity_type: 'call',
      title: 'Initial discovery call with TechCorp',
      description: 'Discuss their requirements and pain points',
      scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
      created_by: user.id,
    },
    {
      activity_type: 'meeting',
      title: 'Product demo for Global Retail',
      description: 'Show key features and answer technical questions',
      scheduled_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
      created_by: user.id,
    },
    {
      activity_type: 'email',
      title: 'Send proposal to FinanceFirst',
      description: 'Detailed proposal with pricing and timeline',
      scheduled_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
      created_by: user.id,
    },
    {
      activity_type: 'demo',
      title: 'Technical demo for HealthPlus',
      description: 'Deep dive into platform capabilities',
      scheduled_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
      created_by: user.id,
    },
    {
      activity_type: 'proposal',
      title: 'Contract review with GreenEnergy',
      description: 'Review and finalize contract terms',
      scheduled_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
      created_by: user.id,
    },
    {
      activity_type: 'call',
      title: 'Follow-up call with EduLearn',
      description: 'Answer questions about implementation',
      scheduled_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      completed: true,
      created_by: user.id,
    },
    {
      activity_type: 'meeting',
      title: 'Quarterly business review',
      description: 'Review performance and discuss expansion',
      scheduled_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      completed: true,
      created_by: user.id,
    },
  ];

  try {
    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .insert(sampleLeads)
      .select();

    if (leadsError) throw leadsError;

    if (leadsData && leadsData.length > 0) {
      const activitiesWithLeads = sampleActivities.map((activity, index) => ({
        ...activity,
        lead_id: index < leadsData.length ? leadsData[index].id : null,
      }));

      const { error: activitiesError } = await supabase
        .from('activities')
        .insert(activitiesWithLeads);

      if (activitiesError) throw activitiesError;
    }

    console.log('Sample data seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding data:', error);
    return false;
  }
}
