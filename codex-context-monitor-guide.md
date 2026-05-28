# Codex 컨텍스트 사용량 모니터 배포 가이드

이 문서는 Codex 앱/CLI 사용자가 로컬 로그를 통해 현재 컨텍스트 사용량을 확인할 수 있도록 돕는 안내서입니다.

## Codex에게 요청하는 문장

아래 문장을 Codex에게 그대로 전달하세요.

```text
이 MD 파일을 읽고, 포함된 PowerShell 스크립트를 실행해서 Codex 컨텍스트 사용량 모니터 창을 띄워줘. 기존 Codex 세션 로그는 ~/.codex/sessions 아래에 있어.
```

## 사용자가 직접 실행하는 방법

1. Codex 앱 또는 Codex CLI에서 대화를 한 번 시작합니다.
2. PowerShell을 엽니다.
3. 아래 스크립트를 `codex-context-monitor.ps1` 파일로 저장합니다.
4. 다음 명령으로 실행합니다.

```powershell
powershell -ExecutionPolicy Bypass -File .\codex-context-monitor.ps1
```

## 읽는 방법

가장 중요한 값은 `현재 컨텍스트`입니다.

```text
현재 컨텍스트: 178,306 / 258,400 tokens (69%)
```

이 값은 최근 모델 호출에 들어간 입력 토큰을 모델 컨텍스트 창 크기와 비교한 값입니다. 컨텍스트 테스트를 할 때는 이 퍼센트만 보면 됩니다.

`세션 누적 전체`는 현재 컨텍스트 사용률이 아니라, 이 세션에서 여러 번 호출하며 누적된 총 토큰 사용량입니다.

## PowerShell 스크립트

```powershell
$Host.UI.RawUI.WindowTitle = 'Codex 컨텍스트 사용량 모니터'

Write-Host 'Codex 컨텍스트 사용량 모니터'
Write-Host '응답이 끝날 때마다 갱신됩니다. 종료: Ctrl+C'
Write-Host ''

$lastLine = $null

while ($true) {
  try {
    $sessionRoot = "$env:USERPROFILE\.codex\sessions"

    if (-not (Test-Path $sessionRoot)) {
      Clear-Host
      Write-Host 'Codex 세션 로그 폴더를 찾을 수 없습니다.'
      Write-Host $sessionRoot
      Write-Host ''
      Write-Host 'Codex 앱이나 CLI에서 대화를 한 번 시작한 뒤 다시 실행하세요.'
      Start-Sleep -Seconds 3
      continue
    }

    $latest = Get-ChildItem -Path $sessionRoot -Recurse -File -ErrorAction Stop |
      Sort-Object LastWriteTime -Descending |
      Select-Object -First 1

    $match = Select-String -Path $latest.FullName -Pattern '"type":"token_count"' |
      Select-Object -Last 1

    if ($match -and $match.Line -ne $lastLine) {
      $lastLine = $match.Line
      $json = $match.Line | ConvertFrom-Json

      $info = $json.payload.info
      $limits = $json.payload.rate_limits

      $window = [double]$info.model_context_window
      $lastInput = [double]$info.last_token_usage.input_tokens
      $pct = if ($window -gt 0) {
        [math]::Round(($lastInput / $window) * 100, 1)
      } else {
        0
      }

      Clear-Host
      Write-Host 'Codex 컨텍스트 사용량 모니터'
      Write-Host ('갱신 시각: {0}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))
      Write-Host ''
      Write-Host ('현재 컨텍스트: {0:N0} / {1:N0} tokens ({2}%)' -f $lastInput, $window, $pct)
      Write-Host ('최근 캐시 입력: {0:N0}' -f $info.last_token_usage.cached_input_tokens)
      Write-Host ('최근 출력:      {0:N0}' -f $info.last_token_usage.output_tokens)
      Write-Host ('최근 총 사용:   {0:N0}' -f $info.last_token_usage.total_tokens)
      Write-Host ''
      Write-Host ('세션 누적 입력: {0:N0}' -f $info.total_token_usage.input_tokens)
      Write-Host ('세션 누적 출력: {0:N0}' -f $info.total_token_usage.output_tokens)
      Write-Host ('세션 누적 전체: {0:N0}' -f $info.total_token_usage.total_tokens)
      Write-Host ''

      if ($limits) {
        Write-Host ('5시간 사용량:   {0}%' -f $limits.primary.used_percent)
        Write-Host ('주간 사용량:    {0}%' -f $limits.secondary.used_percent)
      }

      Write-Host ''
      Write-Host '컨텍스트 테스트 기준: 현재 컨텍스트 %만 보면 됩니다.'
      Write-Host '종료: Ctrl+C'
    }
  } catch {
    Clear-Host
    Write-Host ('오류: {0}' -f $_.Exception.Message)
  }

  Start-Sleep -Seconds 2
}
```

## 주의사항

- 값은 사용자가 입력하는 중에 갱신되지 않고, Codex 응답이 끝난 뒤 갱신됩니다.
- 최신 세션 로그 파일을 자동으로 찾아 감시합니다.
- 여러 Codex 세션을 동시에 실행 중이면 가장 최근에 수정된 세션을 기준으로 표시합니다.
- Windows PowerShell 기준입니다.
