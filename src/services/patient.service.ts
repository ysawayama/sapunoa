// Mock patient service - replace with actual API calls
export const patientService = {
  async getPatientData(userId: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data - replace with actual API call
    return {
      id: userId,
      name: '山田太郎',
      email: 'yamada@example.com',
      lastCheckup: '2024-01-10',
      healthScore: {
        overall: 75,
        categories: {
          nutrition: 82,
          fitness: 68,
          mental: 71,
          sleep: 79,
        },
      },
      recentTests: [
        {
          id: '1',
          name: '血液検査',
          date: '2024-01-10',
          status: 'normal' as const,
          summary: 'すべての数値が正常範囲内です',
        },
        {
          id: '2',
          name: 'ビタミンD検査',
          date: '2024-01-08',
          status: 'attention' as const,
          summary: 'ビタミンD値がやや低めです',
        },
        {
          id: '3',
          name: '甲状腺機能検査',
          date: '2024-01-05',
          status: 'normal' as const,
          summary: 'TSH、T3、T4すべて正常です',
        },
      ],
      supplements: [
        {
          id: '1',
          name: 'ビタミンD3',
          dosage: '2000 IU/日',
          reason: '血中ビタミンD濃度が低いため',
          priority: 'high' as const,
        },
        {
          id: '2',
          name: 'オメガ3脂肪酸',
          dosage: '1000mg/日',
          reason: '心血管系の健康維持のため',
          priority: 'medium' as const,
        },
        {
          id: '3',
          name: 'マグネシウム',
          dosage: '400mg/日',
          reason: '睡眠の質改善のため',
          priority: 'low' as const,
        },
      ],
      insights: [
        {
          id: '1',
          type: 'tip' as const,
          title: '水分補給を心がけましょう',
          description: '1日2リットルの水分摂取が理想的です。こまめに水を飲む習慣をつけましょう。',
          action: {
            label: '詳しく見る',
            href: '/insights/hydration',
          },
        },
        {
          id: '2',
          type: 'warning' as const,
          title: 'ビタミンD不足の可能性',
          description: '最近の検査結果から、ビタミンD値が低めです。日光浴やサプリメントの摂取を検討してください。',
          action: {
            label: '対策を見る',
            href: '/supplements',
          },
        },
        {
          id: '3',
          type: 'success' as const,
          title: '運動習慣が改善されています',
          description: '先月と比較して、活動量が20%増加しています。この調子で続けましょう！',
        },
      ],
    };
  },

  async updateHealthScore(userId: string, score: number) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, score };
  },

  async getTestResults(userId: string, limit?: number) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const allResults = [
      {
        id: '1',
        name: '血液検査',
        date: '2024-01-10',
        status: 'normal' as const,
        summary: 'すべての数値が正常範囲内です',
        details: {
          // Add detailed test results here
        },
      },
      // Add more test results
    ];

    return limit ? allResults.slice(0, limit) : allResults;
  },

  async getSupplementRecommendations(userId: string) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return [
      {
        id: '1',
        name: 'ビタミンD3',
        dosage: '2000 IU/日',
        reason: '血中ビタミンD濃度が低いため',
        priority: 'high' as const,
        price: 2500,
        vendor: 'Sapunoa Health',
      },
      // Add more recommendations
    ];
  },

  async getHealthInsights(userId: string) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return [
      {
        id: '1',
        type: 'tip' as const,
        title: '水分補給を心がけましょう',
        description: '1日2リットルの水分摂取が理想的です。',
        createdAt: new Date().toISOString(),
      },
      // Add more insights
    ];
  },
};