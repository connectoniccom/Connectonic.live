import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface VPNConfig {
  servers: {
    id: string;
    name: string;
    host: string;
    port: number;
    protocol: string;
  }[];
  devices: {
    id: string;
    name: string;
    email: string;
    host: string;
    port: number;
    protocol: string;
    lastActive: string;
    status: string;
    connectionType: string;
    icon: string;
  }[];
  tunnels: {
    id: string;
    name: string;
    sourceDevice: string;
    targetDevice: string;
    status: string;
    sharedBandwidth: string;
    encryption: string;
    lastSync: string;
  }[];
  credentials: {
    username: string;
    password: string;
  };
  configTemplate: string;
}

interface VPNConnection {
  action: string;
  server: {
    id: string;
    name: string;
    host: string;
    port: number;
    protocol: string;
  } | null;
  device: {
    id: string;
    name: string;
    email: string;
    host: string;
    port: number;
    protocol: string;
    lastActive: string;
  } | null;
  tunnel: {
    id: string;
    name: string;
    sourceDevice: string;
    targetDevice: string;
    status: string;
    sharedBandwidth: string;
    encryption: string;
    lastSync: string;
  } | null;
  timestamp: string;
  message: string;
}

export const useVPN = () => {
  const { user } = useAuth();
  const [vpnConfig, setVpnConfig] = useState<VPNConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentServer, setCurrentServer] = useState<string | null>(null);
  const [currentDevice, setCurrentDevice] = useState<string | null>(null);
  const [currentTunnel, setCurrentTunnel] = useState<string | null>(null);

  // Fetch VPN configuration
  const fetchVPNConfig = async (isPublic: boolean = false) => {
    if (!isPublic && !user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const headers: HeadersInit = {};
      
      if (!isPublic && user) {
        const token = await user.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(isPublic ? '/api/vpn-config?public=true' : '/api/vpn-config', {
        headers,
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch VPN configuration');
      }
      
      const config = await response.json();
      setVpnConfig(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Connect to VPN server
  const connectToVPN = async (serverId: string) => {
    if (!user || !vpnConfig) return false;

    try {
      const token = await user.getIdToken();
      
      const response = await fetch('/api/vpn-config', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'connect',
          serverId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to connect to VPN');
      }
      
      const result: VPNConnection = await response.json();
      setIsConnected(true);
      setCurrentServer(serverId);
      setCurrentDevice(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    }
  };

  // Connect to a specific device
  const connectToDevice = async (deviceId: string) => {
    if (!user || !vpnConfig) return false;

    try {
      const token = await user.getIdToken();
      
      const response = await fetch('/api/vpn-config', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'connect',
          deviceId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to connect to device');
      }
      
      const result: VPNConnection = await response.json();
      setIsConnected(true);
      setCurrentDevice(deviceId);
      setCurrentServer(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    }
  };

  // Connect to a specific tunnel
  const connectToTunnel = async (tunnelId: string, isPublic: boolean = false) => {
    if (!isPublic && (!user || !vpnConfig)) return false;

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (!isPublic && user) {
        const token = await user.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(isPublic ? '/api/vpn-config?public=true' : '/api/vpn-config', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'connect',
          tunnelId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to connect to tunnel');
      }
      
      const result: VPNConnection = await response.json();
      setIsConnected(true);
      setCurrentTunnel(tunnelId);
      setCurrentServer(null);
      setCurrentDevice(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    }
  };

  // Disconnect from VPN
  const disconnectFromVPN = async (isPublic: boolean = false) => {
    if (!isPublic && !user) return false;

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (!isPublic && user) {
        const token = await user.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(isPublic ? '/api/vpn-config?public=true' : '/api/vpn-config', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'disconnect',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to disconnect from VPN');
      }
      
      const result: VPNConnection = await response.json();
      setIsConnected(false);
      setCurrentServer(null);
      setCurrentDevice(null);
      setCurrentTunnel(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    }
  };

  // Initialize VPN configuration
  useEffect(() => {
    // For public mode, we don't need to fetch config automatically
    // It will be fetched when needed
    if (user) {
      fetchVPNConfig();
    }
  }, [user]);

  return {
    vpnConfig,
    loading,
    error,
    isConnected,
    currentServer,
    currentDevice,
    currentTunnel,
    connectToVPN,
    connectToDevice,
    connectToTunnel,
    disconnectFromVPN,
    fetchVPNConfig,
  };
};