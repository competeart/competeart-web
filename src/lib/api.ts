const API_URL = import.meta.env.VITE_API_URL;

export async function criarEscola(dados: any) {
  const response = await fetch(`${API_URL}/escolas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar escola");
  }

  return response.json();
}

export async function criarIndependente(dados: any) {
  const response = await fetch(`${API_URL}/independentes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar inscrição independente");
  }

  return response.json();
}

export async function criarBailarino(
  escolaId: string,
  dados: {
    nomeCompleto: string;
    nomeArtistico: string;
    tipoDocumento: "CPF" | "RG";
    documento: string;
    dataNascimento: string;
  },
) {
  const response = await fetch(`${API_URL}/escolas/${escolaId}/bailarinos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar bailarino");
  }

  return response.json();
}

export async function criarBailarinoIndependente(
  independenteId: string,
  dados: {
    nomeCompleto: string;
    nomeArtistico: string;
    tipoDocumento: "CPF" | "RG";
    documento: string;
    dataNascimento: string;
  },
) {
  const response = await fetch(
    `${API_URL}/independentes/${independenteId}/bailarinos`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao criar bailarino");
  }

  return response.json();
}

export async function listarBailarinos(escolaId: string) {
  const response = await fetch(`${API_URL}/escolas/${escolaId}/bailarinos`);

  if (!response.ok) {
    throw new Error("Erro ao carregar bailarinos");
  }

  return response.json();
}

export async function listarBailarinosIndependente(independenteId: string) {
  const response = await fetch(
    `${API_URL}/independentes/${independenteId}/bailarinos`,
  );

  if (!response.ok) {
    throw new Error("Erro ao carregar bailarinos");
  }

  return response.json();
}

export async function criarCoreografia(escolaId: string, dados: any) {
  const response = await fetch(`${API_URL}/escolas/${escolaId}/coreografias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao criar coreografia");
  }

  return response.json();
}

export async function criarCoreografiaIndependente(
  independenteId: string,
  dados: any,
) {
  const response = await fetch(
    `${API_URL}/independentes/${independenteId}/coreografias`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao criar coreografia");
  }

  return response.json();
}

export async function obterResumo(escolaId: string) {
  const response = await fetch(`${API_URL}/escolas/${escolaId}/resumo`);

  if (!response.ok) {
    throw new Error("Erro ao carregar resumo");
  }

  return response.json();
}

export async function obterResumoIndependente(independenteId: string) {
  const response = await fetch(`${API_URL}/independentes/${independenteId}/resumo`);

  if (!response.ok) {
    throw new Error("Erro ao carregar resumo");
  }

  return response.json();
}

export async function listarEscolasAdmin() {
  const token = localStorage.getItem("admin-token");

  if (!token) {
    throw new Error("NAO_AUTENTICADO");
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/escolas`, {
    headers: {
      "x-admin-key": token,
    },
  });
  if (response.status === 401) {
    localStorage.removeItem("admin-token");
    window.location.href = "/admin/login";
    return;
  }

  if (!response.ok) {
    throw new Error("Erro ao carregar escolas");
  }

  return response.json();
}

export async function validarAdmin(token: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/escolas`, {
    headers: {
      "x-admin-key": token,
    },
  });

  return response.ok;
}

export async function validarCheckIn(token: string) {
  const params = new URLSearchParams({
    nome: "aa",
  });

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/check-in/participantes?${params.toString()}`,
    {
      headers: {
        "x-checkin-key": token,
      },
    },
  );

  return response.ok;
}

export async function buscarEscolaAdmin(id: string) {
  const token = localStorage.getItem("admin-token");

  const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/escolas/${id}`, {
    headers: {
      "x-admin-key": token || "",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao carregar escola");
  }

  return response.json();
}

export async function excluirInscricaoAdmin(id: string) {
  const token = localStorage.getItem("admin-token");

  const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/escolas/${id}`, {
    method: "DELETE",
    headers: {
      "x-admin-key": token || "",
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("admin-token");
    window.location.href = "/admin/login";
    return;
  }

  if (!response.ok) {
    throw new Error("Erro ao excluir inscrição");
  }
}

export async function listarEscolasCheckIn() {
  const checkInToken = localStorage.getItem("checkin-token");
  const adminToken = localStorage.getItem("admin-token");

  if (!checkInToken && !adminToken) {
    throw new Error("NAO_AUTENTICADO");
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/check-in/escolas`,
    {
      headers: {
        ...(checkInToken
          ? { "x-checkin-key": checkInToken }
          : { "x-admin-key": adminToken || "" }),
      },
    },
  );

  if (response.status === 401) {
    localStorage.removeItem("checkin-token");
    window.location.href = "/check-in/login";
    return;
  }

  if (!response.ok) {
    throw new Error("Erro ao carregar escolas");
  }

  return response.json();
}

export async function buscarParticipantesCheckIn(
  nome: string,
  filtros?: {
    checkIn?: "TODOS" | "FEITO" | "PENDENTE";
    escolaId?: string;
  },
) {
  const checkInToken = localStorage.getItem("checkin-token");
  const adminToken = localStorage.getItem("admin-token");

  if (!checkInToken && !adminToken) {
    throw new Error("NAO_AUTENTICADO");
  }

  const params = new URLSearchParams({
    nome,
  });

  if (filtros?.checkIn && filtros.checkIn !== "TODOS") {
    params.set("checkIn", filtros.checkIn);
  }

  if (filtros?.escolaId) {
    params.set("escolaId", filtros.escolaId);
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/check-in/participantes?${params.toString()}`,
    {
      headers: {
        ...(checkInToken
          ? { "x-checkin-key": checkInToken }
          : { "x-admin-key": adminToken || "" }),
      },
    },
  );

  if (response.status === 401) {
    localStorage.removeItem("checkin-token");
    window.location.href = "/check-in/login";
    return;
  }

  if (!response.ok) {
    throw new Error("Erro ao buscar participantes");
  }

  return response.json();
}

export async function fazerCheckInParticipante(id: string) {
  const checkInToken = localStorage.getItem("checkin-token");
  const adminToken = localStorage.getItem("admin-token");

  if (!checkInToken && !adminToken) {
    throw new Error("NAO_AUTENTICADO");
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/check-in/participantes/${id}/check-in`,
    {
      method: "PATCH",
      headers: {
        ...(checkInToken
          ? { "x-checkin-key": checkInToken }
          : { "x-admin-key": adminToken || "" }),
      },
    },
  );

  if (response.status === 401) {
    localStorage.removeItem("checkin-token");
    window.location.href = "/check-in/login";
    return;
  }

  if (!response.ok) {
    throw new Error("Erro ao fazer check-in");
  }

  return response.json();
}

function obterHeadersAdmin(): Record<string, string> {
  const adminToken = localStorage.getItem("admin-token");

  if (!adminToken) {
    throw new Error("NAO_AUTENTICADO");
  }

  return { "x-admin-key": adminToken };
}

export type ItemCronograma = {
  id: string;
  ordemCronograma: number;
  nome: string;
  escola: string;
  tempo: string;
  elenco: string;
  coreografo: string;
  contexto: string;
  concluidaCronograma: boolean;
};

export async function listarCronograma(): Promise<ItemCronograma[]> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/cronograma`);

  if (!response.ok) {
    throw new Error("Erro ao carregar cronograma");
  }

  return response.json();
}

export async function reordenarCronograma(
  coreografiasIds: string[],
): Promise<ItemCronograma[]> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/cronograma/ordem`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...obterHeadersAdmin(),
    },
    body: JSON.stringify({ coreografiasIds }),
  });

  if (response.status === 401) {
    localStorage.removeItem("admin-token");
    window.location.href = "/admin/login";
    return [];
  }

  if (!response.ok) {
    throw new Error("Erro ao reordenar cronograma");
  }

  return response.json();
}

export async function marcarConclusaoCronograma(
  coreografiaId: string,
  concluida: boolean,
): Promise<ItemCronograma[]> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/cronograma/${coreografiaId}/conclusao`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...obterHeadersAdmin(),
      },
      body: JSON.stringify({ concluida }),
    },
  );

  if (response.status === 401) {
    localStorage.removeItem("admin-token");
    window.location.href = "/admin/login";
    return [];
  }

  if (!response.ok) {
    throw new Error("Erro ao atualizar cronograma");
  }

  return response.json();
}
