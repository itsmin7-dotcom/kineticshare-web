import React, { useState, useEffect, useRef } from 'react';

export default function DeveloperCenter({ onBack }) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [logs, setLogs] = useState([]);
  const terminalRef = useRef(null);

  const [activeTab, setActiveTab] = useState('python');

  // 사이버틱 스트리밍 JSON 제너레이터 (60fps)
  useEffect(() => {
    let interval;
    if (isStreaming) {
      interval = setInterval(() => {
        const mockJoints = ['r_shoulder', 'r_elbow', 'r_wrist', 'l_shoulder', 'l_knee', 'pelvis', 'head', 'torso_yaw'];
        const randomJoint = mockJoints[Math.floor(Math.random() * mockJoints.length)];
        const randomAngle = (Math.random() * 180 - 90).toFixed(4);
        const randomVel = (Math.random() * 2).toFixed(4);
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 23);
        
        const newLog = `[${timestamp}] RECV: {"dof_id": "${randomJoint}", "q": ${randomAngle}, "dq": ${randomVel}, "status": "SYNCED"}`;
        
        setLogs(prev => {
          const updated = [...prev, newLog];
          // 최근 35줄만 유지하여 화면에 꽉 차게 흘러가도록 처리 (스크롤 퍼포먼스 고려)
          if (updated.length > 35) return updated.slice(updated.length - 35);
          return updated;
        });
      }, 16); // 약 60프레임 속도 (16ms)
    } else {
      // 멈출 때는 빈 화면 혹은 초기화 유지
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    // 개발자 센터 강제 다크 테마 컨테이너 (App.jsx의 테마와 무관하게 독자적인 다크 환경 구축)
    <div className="min-h-[85vh] bg-[#050505] rounded-[3rem] p-8 md:p-12 border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col font-sans animate-fade-in text-slate-300">
      
      {/* 백그라운드 효과 */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-green-900/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* 헤더 네비게이션 구역 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
        <button 
          onClick={onBack}
          className="text-slate-400 hover:text-white flex items-center gap-3 text-sm font-bold tracking-wide transition-all duration-300 group bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full border border-white/10"
        >
          <span className="group-hover:-translate-x-1.5 transition-transform duration-300">&larr;</span> 
          마켓플레이스로 돌아가기
        </button>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 shadow-inner">
            <span className="text-xl">👩‍💻</span>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">KineticShare Developer Center</h1>
            <p className="text-slate-500 font-mono text-sm mt-1">API v2.0 - Real-time Motion Data Streaming</p>
          </div>
        </div>
      </div>

      {/* 2단 분리 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 relative z-10">
        
        {/* [좌측 패널] macOS 스타일 코드 에디터 UI */}
        <div className="flex flex-col rounded-2xl bg-[#0d0d0f] border border-slate-800 shadow-2xl overflow-hidden h-[600px]">
          {/* macOS 윈도우 헤더 */}
          <div className="h-10 bg-[#161618] border-b border-slate-800 flex items-center px-4 justify-between select-none">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('python')}
                className={`text-xs font-mono font-bold transition-colors ${activeTab === 'python' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                client.py
              </button>
              <button 
                onClick={() => setActiveTab('ros2')}
                className={`text-xs font-mono font-bold transition-colors ${activeTab === 'ros2' ? 'text-green-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                ros2_node.cpp
              </button>
            </div>
            <div className="w-12"></div> {/* 우측 밸런스 */}
          </div>
          
          {/* 코드 에디터 본문 (Syntax Highlighting 흉내) */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed whitespace-pre bg-[#0d0d0f] text-slate-300">
            {activeTab === 'python' && (
              <code>
<span className="text-purple-400">import</span> asyncio{'\n'}
<span className="text-purple-400">import</span> websockets{'\n'}
<span className="text-purple-400">import</span> json{'\n'}
{'\n'}
API_KEY = <span className="text-green-300">"ks_live_..."</span>{'\n'}
STREAM_URL = <span className="text-green-300">"wss://api.kineticshare.com/v2/stream"</span>{'\n'}
{'\n'}
<span className="text-purple-400">async def</span> <span className="text-blue-400">fetch_motion_data</span>(asset_id):{'\n'}
{'    '}<span className="text-slate-500"># 스마트 컨트랙트 검증을 통과한 에셋 연결</span>{'\n'}
{'    '}uri = <span className="text-green-300">f"</span><span className="text-yellow-200">{'{'}</span><span className="text-white">STREAM_URL</span><span className="text-yellow-200">{'}'}</span><span className="text-green-300">?asset=</span><span className="text-yellow-200">{'{'}</span><span className="text-white">asset_id</span><span className="text-yellow-200">{'}'}</span><span className="text-green-300">"</span>{'\n'}
{'    '}<span className="text-purple-400">async with</span> websockets.connect(uri) <span className="text-purple-400">as</span> ws:{'\n'}
{'        '}<span className="text-purple-400">await</span> ws.send(json.dumps(<span className="text-yellow-200">{'{'}</span><span className="text-green-300">"auth"</span>: API_KEY<span className="text-yellow-200">{'}'}</span>)){'\n'}
{'        '}{'\n'}
{'        '}<span className="text-slate-500"># 60fps 실시간 프레임 수신 루프</span>{'\n'}
{'        '}<span className="text-purple-400">while True</span>:{'\n'}
{'            '}frame_data = <span className="text-purple-400">await</span> ws.recv(){'\n'}
{'            '}kinematics = json.loads(frame_data){'\n'}
{'            '}<span className="text-blue-200">print</span>(<span className="text-green-300">f"Received Joint:</span> <span className="text-yellow-200">{'{'}</span><span className="text-white">kinematics['dof_id']</span><span className="text-yellow-200">{'}'}</span><span className="text-green-300">"</span>){'\n'}
{'            '}<span className="text-slate-500"># 로봇 하드웨어 컨트롤러로 맵핑 전송...</span>{'\n'}
{'\n'}
<span className="text-purple-400">if</span> __name__ == <span className="text-green-300">"__main__"</span>:{'\n'}
{'    '}asyncio.run(fetch_motion_data(<span className="text-green-300">"dom-001"</span>))
              </code>
            )}
            
            {activeTab === 'ros2' && (
              <code>
<span className="text-purple-400">#include</span> <span className="text-green-300">&lt;rclcpp/rclcpp.hpp&gt;</span>{'\n'}
<span className="text-purple-400">#include</span> <span className="text-green-300">"kineticshare_interfaces/msg/joint_state_stream.hpp"</span>{'\n'}
{'\n'}
<span className="text-purple-400">class</span> <span className="text-yellow-200">KineticStreamNode</span> : <span className="text-purple-400">public</span> rclcpp::Node{'\n'}
<span className="text-yellow-200">{'{'}</span>{'\n'}
<span className="text-purple-400">public:</span>{'\n'}
{'  '}<span className="text-blue-400">KineticStreamNode</span>(){'\n'}
{'  '}: Node(<span className="text-green-300">"kinetic_stream_receiver"</span>){'\n'}
{'  '}<span className="text-yellow-200">{'{'}</span>{'\n'}
{'    '}subscription_ = <span className="text-purple-400">this</span>-&gt;create_subscription&lt;kineticshare_interfaces::msg::JointStateStream&gt;({'\n'}
{'      '}<span className="text-green-300">"/ks/stream/dom_001"</span>, 10,{'\n'}
{'      '}<span className="text-purple-400">std::bind</span>(&amp;KineticStreamNode::topic_callback, <span className="text-purple-400">this</span>, std::placeholders::_1));{'\n'}
{'  '}<span className="text-yellow-200">{'}'}</span>{'\n'}
{'\n'}
<span className="text-purple-400">private:</span>{'\n'}
{'  '}<span className="text-purple-400">void</span> <span className="text-blue-400">topic_callback</span>(<span className="text-purple-400">const</span> kineticshare_interfaces::msg::JointStateStream::SharedPtr msg) <span className="text-purple-400">const</span>{'\n'}
{'  '}<span className="text-yellow-200">{'{'}</span>{'\n'}
{'    '}RCLCPP_INFO(<span className="text-purple-400">this</span>-&gt;get_logger(), <span className="text-green-300">"Target Hardware: Unitree H1 | Applying DOF: '%s'"</span>, msg-&gt;dof_id.c_str());{'\n'}
{'    '}<span className="text-slate-500">// 하드웨어 IK 솔버 연동 구현부</span>{'\n'}
{'  '}<span className="text-yellow-200">{'}'}</span>{'\n'}
{'  '}rclcpp::Subscription&lt;kineticshare_interfaces::msg::JointStateStream&gt;::SharedPtr subscription_;{'\n'}
<span className="text-yellow-200">{'}'}</span>;
              </code>
            )}
          </div>
        </div>

        {/* [우측 패널] API 테스트 터미널 시뮬레이터 */}
        <div className="flex flex-col h-[600px]">
          
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">실시간 스트리밍 터미널</h2>
              <p className="text-sm text-slate-500 font-medium">데이터 라이선스 구매 후 로컬 엔드포인트 연결 시뮬레이션</p>
            </div>
            <button 
              onClick={() => setIsStreaming(!isStreaming)}
              className={`px-8 py-3.5 rounded-full font-extrabold text-sm transition-all duration-300 shadow-lg ${
                isStreaming 
                ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                : 'bg-green-500/10 text-green-400 border border-green-500/50 hover:bg-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:-translate-y-0.5'
              }`}
            >
              {isStreaming ? '■ 스트리밍 중지' : '▶ API 테스트 실행'}
            </button>
          </div>

          {/* 블랙 해커 터미널 창 */}
          <div 
            ref={terminalRef}
            className="flex-1 bg-black rounded-2xl border border-slate-800 shadow-inner overflow-hidden p-6 font-mono text-xs sm:text-sm leading-relaxed flex flex-col justify-end"
          >
            {!isStreaming && logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50 space-y-4">
                <span className="text-5xl">⚡</span>
                <p>우측 상단의 [API 테스트 실행] 버튼을 클릭하여</p>
                <p>60fps 스트리밍을 체험하세요.</p>
              </div>
            ) : (
              <div className="w-full flex flex-col space-y-1">
                {logs.map((log, idx) => (
                  <div key={idx} className="text-green-400 opacity-90 break-all drop-shadow-[0_0_3px_rgba(74,222,128,0.5)]">
                    {log}
                  </div>
                ))}
                {isStreaming && (
                  <div className="text-green-400 animate-pulse mt-2">_</div>
                )}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
