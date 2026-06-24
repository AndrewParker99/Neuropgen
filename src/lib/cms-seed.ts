import { CmsSite } from "@/types/cms";

function block(id: string, type: CmsSite["sections"][number]["topics"][number]["subtopics"][number]["blocks"][number]["type"], order: number, title: string, text?: string, url?: string) {
  return { id, type, order, title, text, url };
}

export const cmsSeed: CmsSite = {
  sections: [
    {
      id: "enfermedades",
      slug: "enfermedades",
      title: "Enfermedades Genéticas",
      icon: "🧬",
      summary: "Biblioteca clara sobre síndromes, genética y apoyos.",
      order: 1,
      status: "published",
      topics: [
        {
          id: "sindrome-de-turner",
          slug: "sindrome-de-turner",
          title: "Síndrome de Turner",
          summary: "Biblioteca clara sobre síndrome de Turner, genética, manifestaciones y apoyos para casa y escuela.",
          order: 1,
          status: "published",
          subtopics: [
            {
              id: "que-es",
              slug: "que-es",
              title: "¿Qué es?",
              order: 1,
              status: "published",
              blocks: [
                block("b1", "text", 1, "¿Qué es?", "Explicación para familias con formato simple."),
                block("b2", "image", 2, "Imagen principal", "Subida desde Firebase Storage.", "")
              ]
            },
            {
              id: "causa-genetica",
              slug: "causa-genetica",
              title: "Causa genética",
              order: 2,
              status: "published",
              blocks: [block("b3", "text", 1, "Causa genética", "Descripción de la causa genética.")]
            },
            {
              id: "manifestaciones-clinicas",
              slug: "manifestaciones-clinicas",
              title: "Manifestaciones clínicas",
              order: 3,
              status: "published",
              blocks: [block("b4", "text", 1, "Manifestaciones clínicas", "Listado de manifestaciones clínicas.")]
            },
            {
              id: "perfil-neuropsicologico",
              slug: "perfil-neuropsicologico",
              title: "Perfil neuropsicológico",
              order: 4,
              status: "published",
              blocks: [block("b5", "text", 1, "Perfil neuropsicológico", "Descripción del perfil neuropsicológico.")]
            },
            {
              id: "recomendaciones-para-casa",
              slug: "recomendaciones-para-casa",
              title: "Recomendaciones para casa",
              order: 5,
              status: "published",
              blocks: [block("b6", "text", 1, "Recomendaciones para casa", "Sugerencias prácticas para la familia.")]
            },
            {
              id: "recomendaciones-para-escuela",
              slug: "recomendaciones-para-escuela",
              title: "Recomendaciones para escuela",
              order: 6,
              status: "published",
              blocks: [block("b7", "text", 1, "Recomendaciones para escuela", "Sugerencias prácticas para el entorno escolar.")]
            },
            {
              id: "recursos-descargables",
              slug: "recursos-descargables",
              title: "Recursos descargables",
              order: 7,
              status: "published",
              blocks: [block("b8", "pdf", 1, "Recurso descargable", "Archivo descargable para casa o escuela.", "")]
            },
            {
              id: "videos-relacionados",
              slug: "videos-relacionados",
              title: "Videos relacionados",
              order: 8,
              status: "published",
              blocks: [block("b9", "video", 1, "Video relacionado", "YouTube o video subido.", "https://youtube.com/")]
            }
          ]
        },
        {
          id: "sindrome-x-fragil",
          slug: "sindrome-x-fragil",
          title: "Síndrome X Frágil",
          summary: "Información sobre causa genética, perfil del neurodesarrollo y recomendaciones.",
          order: 2,
          status: "published",
          subtopics: [
            {
              id: "que-es",
              slug: "que-es",
              title: "¿Qué es?",
              order: 1,
              status: "published",
              blocks: [block("b10", "text", 1, "¿Qué es?", "Explicación para familias con formato simple.")]
            }
          ]
        },
        {
          id: "sindrome-de-williams",
          slug: "sindrome-de-williams",
          title: "Síndrome de Williams",
          summary: "Tema listo para completar desde el panel administrador.",
          order: 3,
          status: "draft",
          subtopics: []
        },
        {
          id: "cadasil",
          slug: "cadasil",
          title: "CADASIL",
          summary: "Tema listo para completar desde el panel administrador.",
          order: 4,
          status: "draft",
          subtopics: []
        }
      ]
    },
    {
      id: "psicoeducacion",
      slug: "psicoeducacion",
      title: "Psicoeducación",
      icon: "🧠",
      summary: "Videos y explicaciones sobre neurodesarrollo y aprendizaje.",
      order: 2,
      status: "published",
      topics: [
        {
          id: "neurodesarrollo",
          slug: "neurodesarrollo",
          title: "Neurodesarrollo",
          summary: "Videos y explicaciones para comprender hitos, conducta y aprendizaje.",
          order: 1,
          status: "published",
          subtopics: [
            {
              id: "introduccion",
              slug: "introduccion",
              title: "Introducción",
              order: 1,
              status: "published",
              blocks: [block("b11", "text", 1, "Introducción", "Texto introductorio sobre neurodesarrollo.")]
            },
            {
              id: "video-educativo",
              slug: "video-educativo",
              title: "Video educativo",
              order: 2,
              status: "published",
              blocks: [block("b12", "video", 1, "Video educativo", "", "https://youtube.com/")]
            }
          ]
        },
        {
          id: "autismo",
          slug: "autismo",
          title: "Autismo",
          summary: "Material sobre el espectro autista y estrategias de acompañamiento.",
          order: 2,
          status: "draft",
          subtopics: []
        },
        {
          id: "tdah",
          slug: "tdah",
          title: "TDAH",
          summary: "Material sobre atención, impulsividad y estrategias prácticas.",
          order: 3,
          status: "draft",
          subtopics: []
        },
        {
          id: "funciones-ejecutivas",
          slug: "funciones-ejecutivas",
          title: "Funciones Ejecutivas",
          summary: "Material sobre planeación, memoria de trabajo, atención y regulación.",
          order: 4,
          status: "published",
          subtopics: [
            {
              id: "introduccion",
              slug: "introduccion",
              title: "Introducción",
              order: 1,
              status: "published",
              blocks: [block("b13", "text", 1, "Introducción", "Explicación para familias con formato simple.")]
            }
          ]
        }
      ]
    },
    {
      id: "recursos",
      slug: "recursos",
      title: "Recursos para Familias",
      icon: "📚",
      summary: "Guías, infografías, checklists y materiales descargables.",
      order: 3,
      status: "published",
      topics: [
        {
          id: "guias",
          slug: "guias",
          title: "Guías",
          summary: "Materiales descargables para acompañamiento en casa y escuela.",
          order: 1,
          status: "published",
          subtopics: [
            {
              id: "descripcion",
              slug: "descripcion",
              title: "Descripción",
              order: 1,
              status: "published",
              blocks: [block("b14", "text", 1, "Descripción", "Descripción general de la guía.")]
            },
            {
              id: "pdf-descargable",
              slug: "pdf-descargable",
              title: "PDF descargable",
              order: 2,
              status: "published",
              blocks: [block("b15", "pdf", 1, "PDF descargable", "", "")]
            }
          ]
        },
        {
          id: "infografias",
          slug: "infografias",
          title: "Infografías",
          summary: "Material visual de apoyo para familias y escuela.",
          order: 2,
          status: "draft",
          subtopics: []
        },
        {
          id: "checklists",
          slug: "checklists",
          title: "Checklists",
          summary: "Listas prácticas para organizar información y seguimiento.",
          order: 3,
          status: "published",
          subtopics: [
            {
              id: "descripcion",
              slug: "descripcion",
              title: "Descripción",
              order: 1,
              status: "published",
              blocks: [block("b16", "text", 1, "Descripción", "Descripción general del checklist.")]
            }
          ]
        },
        {
          id: "material-escolar",
          slug: "material-escolar",
          title: "Material escolar",
          summary: "Recursos pensados para docentes y entorno escolar.",
          order: 4,
          status: "draft",
          subtopics: []
        }
      ]
    },
    {
      id: "grupo-apoyo",
      slug: "grupo-apoyo",
      title: "Grupo de Apoyo",
      icon: "🤝",
      summary: "Próxima reunión, tema, modalidad e inscripción.",
      order: 4,
      status: "published",
      topics: [
        {
          id: "reuniones",
          slug: "reuniones",
          title: "Reuniones",
          summary: "Próxima reunión, modalidad, tema, inscripción y datos de contacto.",
          order: 1,
          status: "published",
          subtopics: [
            {
              id: "proxima-reunion",
              slug: "proxima-reunion",
              title: "Próxima reunión",
              order: 1,
              status: "published",
              blocks: [block("b17", "note", 1, "Próxima reunión", "Información de la próxima reunión del grupo de apoyo.")]
            }
          ]
        },
        {
          id: "inscripcion",
          slug: "inscripcion",
          title: "Inscripción",
          summary: "Cómo inscribirte al grupo de apoyo.",
          order: 2,
          status: "draft",
          subtopics: []
        },
        {
          id: "contacto",
          slug: "contacto",
          title: "Contacto",
          summary: "Datos de contacto del equipo NeuropGen.",
          order: 3,
          status: "draft",
          subtopics: []
        }
      ]
    }
  ]
};
