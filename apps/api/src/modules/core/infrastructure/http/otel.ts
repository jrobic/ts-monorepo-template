/* eslint-disable no-console */
import { trace as otelTrace } from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FastifyInstrumentation } from '@opentelemetry/instrumentation-fastify';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { Resource } from '@opentelemetry/resources';
import { BatchSpanProcessor, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { PrismaInstrumentation } from '@prisma/instrumentation';
// import { B3InjectEncoding, B3Propagator } from "@opentelemetry/propagator-b3";

// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

export function registerTracing() {
  // Tracer provider
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'api',
    }),
  });

  // Tracer exporter
  // Configure how spans are processed and exported. In this case we're sending spans
  // as we receive them to an OTLP-compatible collector (e.g. Jaeger).
  const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318';
  const traceExporter = new OTLPTraceExporter({
    url: `${endpoint}/v1/traces`,
  });
  // { url: "http://localhost:4318/v1/traces", }

  if (process.env.NODE_ENV === 'production') {
    provider.addSpanProcessor(new BatchSpanProcessor(traceExporter));
  } else {
    provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));
  }

  provider.register({
    propagator: new JaegerPropagator(),
    // propagator: new B3Propagator({
    //   injectEncoding: B3InjectEncoding.MULTI_HEADER,
    // }),
  });

  // Register your auto-instrumentors
  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      new PinoInstrumentation({
        logHook: (_span, record, _level) => {
          // eslint-disable-next-line no-param-reassign
          record['resource.service.name'] = provider.resource.attributes['service.name'];
        },
      }),
      new HttpInstrumentation(),
      new FastifyInstrumentation(),
      new PrismaInstrumentation({ middleware: true }),
      new PgInstrumentation(),
    ],
  });
}

export const trace = otelTrace.getTracer('api');
