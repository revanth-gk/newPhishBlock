-- PhishBlock Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create reports table
CREATE TABLE reports (
  id BIGINT PRIMARY KEY,
  reporter_address TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('URL', 'WALLET')),
  target TEXT NOT NULL,
  ipfs_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VALIDATED', 'REJECTED', 'DISPUTED')),
  votes_for INTEGER DEFAULT 0,
  votes_against INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create validators table
CREATE TABLE validators (
  address TEXT PRIMARY KEY,
  reputation_score INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table to track individual votes
CREATE TABLE votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  report_id BIGINT NOT NULL,
  voter_address TEXT NOT NULL,
  vote BOOLEAN NOT NULL, -- true for valid, false for invalid
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(report_id, voter_address)
);

-- Create indexes for better performance
CREATE INDEX idx_reports_target ON reports(target);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at);
CREATE INDEX idx_reports_reporter_address ON reports(reporter_address);
CREATE INDEX idx_votes_report_id ON votes(report_id);
CREATE INDEX idx_votes_voter_address ON votes(voter_address);
CREATE INDEX idx_validators_address ON validators(address);

-- Enable Row Level Security
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE validators ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create policies for reports
CREATE POLICY "Anyone can view validated reports" ON reports
  FOR SELECT USING (status = 'VALIDATED');

CREATE POLICY "Users can view their own reports" ON reports
  FOR SELECT USING (reporter_address = auth.jwt() ->> 'wallet_address');

CREATE POLICY "Authenticated users can insert reports" ON reports
  FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet_address' IS NOT NULL);

-- Create policies for validators
CREATE POLICY "Anyone can view validators" ON validators
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage validators" ON validators
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for votes
CREATE POLICY "Users can view votes" ON votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert votes" ON votes
  FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet_address' IS NOT NULL);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE
  ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();