/**
 * Script de Teste - Geração Manual de PDF
 * Use este script para testar o envio de email sem precisar fazer um pagamento real
 */

// Como usar:
// 1. Abra o DevTools (F12)
// 2. Vá na aba Console
// 3. Cole este código e pressione Enter

async function testPDFGeneration() {
    // Pegar dados do localStorage
    const intake = JSON.parse(localStorage.getItem('intake') || '{}');
    const preview = JSON.parse(localStorage.getItem('preview') || '{}');

    if (!intake.email) {
        console.error('❌ Nenhum email encontrado. Complete o quiz primeiro!');
        return;
    }

    console.log('📧 Email:', intake.email);
    console.log('📊 Dados do intake:', intake);

    // Chamar API de geração de PDF
    try {
        console.log('🔄 Gerando PDF e enviando email...');

        const response = await fetch('/api/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionId: 'test_' + Date.now(),
                email: intake.email,
                customerName: intake.name,
                days: 7,
                intakeId: 'test_intake_' + Date.now(),
                currency: 'BRL',
            }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Sucesso!', result);
            console.log('📧 Email enviado para:', intake.email);
        } else {
            const error = await response.text();
            console.error('❌ Erro:', error);
        }
    } catch (error) {
        console.error('❌ Erro ao chamar API:', error);
    }
}

// Executar
testPDFGeneration();
