import { render } from '@react-email/render';
import { AssignmentResultEmail } from '@/components/emails/AssignmentResultEmail';
import Link from 'next/link';

const SAMPLE_ASSIGNMENT = {
  studentName: 'Marie Dupont',
  assignmentTitle: 'Les verbes réguliers -er',
  scoreText: '18/20',
  feedback:
    'Très bon travail sur la conjugaison. Pense à revoir l’accord du participe passé avec être.',
};

export default async function EmailsPage() {
  const assignmentResultHtml = await render(
    <AssignmentResultEmail
      studentName={SAMPLE_ASSIGNMENT.studentName}
      assignmentTitle={SAMPLE_ASSIGNMENT.assignmentTitle}
      scoreText={SAMPLE_ASSIGNMENT.scoreText}
      feedback={SAMPLE_ASSIGNMENT.feedback}
    />
  );

  const templates: Array<{
    id: string;
    name: string;
    description: string;
    html: string;
    sample?: { studentName: string; assignmentTitle: string; scoreText: string };
  }> = [
    {
      id: 'assignment-result',
      name: 'Assignment Result',
      description: 'Sent to guardians when a student’s assignment is graded.',
      html: assignmentResultHtml,
      sample: SAMPLE_ASSIGNMENT,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Email templates
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Preview how transactional emails look before they’re sent.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Back to app
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <ul className="space-y-10">
          {templates.map((template) => (
            <li key={template.id}>
              <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
                  <h2 className="font-semibold text-gray-900">
                    {template.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {template.description}
                  </p>
                  {template.sample && (
                    <p className="mt-2 text-xs text-gray-500">
                      Sample: {template.sample.studentName} —{' '}
                      {template.sample.assignmentTitle} ({template.sample.scoreText})
                    </p>
                  )}
                </div>
                <div className="border-t border-gray-100 bg-gray-100/50 p-4">
                  <div className="mx-auto max-w-[600px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-inner">
                    <iframe
                      title={`Preview: ${template.name}`}
                      srcDoc={template.html}
                      className="h-[520px] w-full border-0"
                      sandbox="allow-same-origin"
                    />
                  </div>
                </div>
              </section>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
