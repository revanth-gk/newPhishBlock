import { getSupabaseClient } from '@/lib/supabase';

export interface Report {
  id: number;
  reporter_address: string;
  report_type: string;
  target: string;
  ipfs_hash: string;
  status: string;
  votes_for: number;
  votes_against: number;
  created_at: string;
  updated_at: string;
}

export class DatabaseService {
  static async syncReport(reportData: any) {
    const supabase = getSupabaseClient();
    
    try {
      const { data, error } = await supabase
        .from('reports')
        .upsert({
          id: reportData.id,
          reporter_address: reportData.reporter,
          report_type: reportData.reportType,
          target: reportData.target,
          ipfs_hash: reportData.ipfsHash,
          status: reportData.status,
          votes_for: reportData.votesFor,
          votes_against: reportData.votesAgainst,
        });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error syncing report:', error);
      throw error;
    }
  }

  static async checkTarget(target: string) {
    const supabase = getSupabaseClient();
    
    try {
      // In a real implementation, this would query the database
      // For now, we'll return mock data
      const mockData = [
        {
          id: 1,
          reporter_address: '0x1234...5678',
          report_type: 'URL',
          target: target,
          ipfs_hash: 'QmHash123',
          status: 'VALIDATED',
          votes_for: 5,
          votes_against: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
      
      return mockData;
    } catch (error) {
      console.error('Error checking target:', error);
      throw error;
    }
  }

  static async getReportsByStatus(status: string) {
    const supabase = getSupabaseClient();
    
    try {
      // In a real implementation, this would query the database
      // For now, we'll return mock data
      const mockData = [
        {
          id: 1,
          reporter_address: '0x1234...5678',
          report_type: 'URL',
          target: 'https://fake-site.com',
          ipfs_hash: 'QmHash123',
          status: status,
          votes_for: 5,
          votes_against: 1,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 2,
          reporter_address: '0x5678...9012',
          report_type: 'WALLET',
          target: '0xabcdef1234567890abcdef1234567890abcdef12',
          ipfs_hash: 'QmHash456',
          status: status,
          votes_for: 3,
          votes_against: 2,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
      
      return mockData;
    } catch (error) {
      console.error('Error getting reports by status:', error);
      throw error;
    }
  }

  static async getAllReports() {
    const supabase = getSupabaseClient();
    
    try {
      // In a real implementation, this would query the database
      // For now, we'll return mock data
      const mockData = [
        {
          id: 1,
          reporter_address: '0x1234...5678',
          report_type: 'URL',
          target: 'https://fake-site.com',
          ipfs_hash: 'QmHash123',
          status: 'VALIDATED',
          votes_for: 5,
          votes_against: 1,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 2,
          reporter_address: '0x5678...9012',
          report_type: 'WALLET',
          target: '0xabcdef1234567890abcdef1234567890abcdef12',
          ipfs_hash: 'QmHash456',
          status: 'PENDING',
          votes_for: 2,
          votes_against: 1,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
      
      return mockData;
    } catch (error) {
      console.error('Error getting all reports:', error);
      throw error;
    }
  }
}